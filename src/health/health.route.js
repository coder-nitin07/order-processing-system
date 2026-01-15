import express from 'express';
import pool from '../database/postgres.js';
import { redisClient } from '../redis/redisClient.js';

const router = express.Router();

router.get('/', async (req, res)=>{
    try {
        await pool.query('SELECT 1');
        await redisClient.ping();

        res.json({ 
            status: 'ok',
            db: 'connected',
            redis: 'connected'
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: 'Service unhealthy'
        });
    }
});

export default router;