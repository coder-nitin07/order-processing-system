import { Queue } from "bullmq";
import { connectRedis } from "../config/redis.js";

export const emailQueue = new Queue('email-queue',  {
    connection: connectRedis
});