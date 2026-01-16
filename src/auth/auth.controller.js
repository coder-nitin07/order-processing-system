import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../users/user.repository.js';
import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';

export async function register(req, res){
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: 'Email and Password required' });
    }

    const existingUser = await findUserByEmail(email);
    if(existingUser){
        return res.status(404).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
        email, 
        password: hashedPassword,
        role: 'USER'
    });

    res.status(201).json({
        message: 'User registered successfully',
        user
    });
};

export async function login(req, res){
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await findUserByEmail(email);
    if(!user){
        return res.status(401).json({ message: 'Invalid credentails' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({ message: 'Invalid credentails' });
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    );

    res.json({ 
        message: 'Login successfully',
        token
    });
};