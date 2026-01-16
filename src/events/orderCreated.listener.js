import { redisSubscriber } from '../config/redis.js';
import { paymentQueue } from '../queues/payment.queue.js';
import { EVENT_TYPES } from './eventTypes.js';

export const initOrderCreatedListener = async () =>{
    await redisSubscriber.subscribe(EVENT_TYPES.ORDER_CREATED, async (message)=>{
        const event = JSON.parse(message);

        console.log('ORDER_CREATED event received');
        // console.log(event);

        console.log("➡️ Order ID:", event.payload.orderId);

        // add jpb to queue
        await paymentQueue.add('process-payment', {
            orderId: event.payload.orderId,
            userId: event.payload.userId,
            amount: event.payload.amount
        });

        console.log("➡️ Next steps:");
        console.log("   - enqueue payment job");
        console.log("   - enqueue notification job");
    });
};