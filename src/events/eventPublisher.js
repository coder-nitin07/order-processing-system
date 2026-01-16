import { redisPublisher } from '../config/redis.js';

export const publishEvent = async (eventType, payload) =>{
    try {
        await redisPublisher.publish(
            eventType,
            JSON.stringify({
                eventType,
                payload,
                timestamp: new Date().toISOString()
            })
        );
    } catch (err) {
        console.log(`Failed to publish events: ${ err }`);
    }
};