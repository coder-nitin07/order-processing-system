import { createClient } from "redis";
import { env } from '../config/env.js';

export const redisClient = createClient({
    url: env.redisUrl
});

export async function connectRedis(){
    try {
        await redisClient.connect();
        console.log(`Redis Connected`);
    } catch (error) {
        console.error('Redis connection failed');
        throw error;
    }
};