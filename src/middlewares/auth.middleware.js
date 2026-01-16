import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticate(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export function authorizeRoles(...allowedRoles){
    return (req, res, next) =>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
}