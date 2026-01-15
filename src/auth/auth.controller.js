import bcrypt from 'bcrypt';
import { findUserByEmail } from '../users/user.repository.js';

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