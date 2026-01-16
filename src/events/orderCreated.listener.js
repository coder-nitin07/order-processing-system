import { redisSubscriber } from '../config/redis.js';
import { EVENT_TYPES } from './eventTypes.js';

export const initOrderCreatedListener = async () =>{
    await redisSubscriber.subscribe(EVENT_TYPES.ORDER_CREATED, (message)=>{
        const event = JSON.parse(message);

        console.log('ORDER_CREATED event received');
        // console.log(event);

        console.log("➡️ Order ID:", event.payload.orderId);
        console.log("➡️ Next steps:");
        console.log("   - enqueue payment job");
        console.log("   - enqueue notification job");
    });
};