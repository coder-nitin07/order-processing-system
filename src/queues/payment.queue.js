import { Queue } from "bullmq";
import { connectRedis } from '../config/redis.js';

export const paymentQueue = new Queue('payment-processing', {
    connection: connectRedis
});