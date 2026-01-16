import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

// publisher
export const redisPublisher = createClient({
    url: redisUrl
});

// subscriber
export const redisSubscriber = createClient({
    url: redisUrl
});

let isConnected = false;

export const connectRedis = async ()=>{
    if(isConnected) return;

    await redisPublisher.connect();
    await redisSubscriber.connect();

    isConnected = true;
    console.log('Redis Subscriber and Publisher connected');
};