import { Worker } from "bullmq";
import { connectRedis } from "../config/redis.js";
import pool from "../database/postgres.js";
import { EVENT_TYPES } from "../events/eventTypes.js";
import { publishEvent } from "../events/eventPublisher.js";
import ORDER_STATUS from "../constants/orderStatus.js";

export const paymentWorker = new Worker(
    'payment-processing',
    async (job) => {
        const { orderId, amount } = job.data;
        console.log(`Processing payment Job`, job.id);
        console.log('Job data', job.data);

        console.log("Processing payment for order", orderId);

        // simulate fake payment (80% success rate)
        const isPaymentSuccessful = Math.random() < 0.8;

        const client = await pool.connect();

        try {
            console.log("first")
            await client.query('BEGIN');

            if(isPaymentSuccessful){
                // update order status
                await client.query(
                    `UPDATE orders SET status = $1 WHERE id = $2`,
                    [ ORDER_STATUS.PAID, orderId ]
                )

                // exit success event
                await publishEvent(EVENT_TYPES.ORDER_PAYMENT_SUCCESS, {
                    orderId,
                    amount
                });

                console.log('Payment success for order: ', orderId);
            } else{
console.log("secong")
                // update order status failed
                await client.query(
                    `UPDATE orders SET status = $1 WHERE id = $2`,
                    [ ORDER_STATUS.FAILED, orderId ]
                );

                // emit failues event
                await publishEvent(EVENT_TYPES.ORDER_PAYMENT_FAILED, {
                    orderId,
                    amount
                });

                console.log('Payment Failed for order', orderId);
            }

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            console.error("Worker error:", err);
            throw err;
        } finally{
            client.release();
        }

        // placeholder logic
        return { success: isPaymentSuccessful };
    },
    {
        connection: connectRedis
    }
);