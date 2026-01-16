import pool from '../database/postgres.js';
import ORDER_STATUS from "../constants/orderStatus.js";
import { createOrderSchema } from "../validators/order.validator.js";
import { publishEvent } from '../events/eventPublisher.js';
import { EVENT_TYPES } from "../events/eventTypes.js";

// create order
export const createOrder = async (req, res, next)=>{
    const client = await pool.connect();

    try {
        // validate request
        const { error, value } = createOrderSchema.validate(req.body);
        if(error){
            return res.status(400).json({ message: error.message });
        }

        const { amount } = value;
        const userId = req.user.userId;

        // insert order
        const query = `
            INSERT INTO orders (user_id, amount, status)
            VALUES ($1, $2, $3)
            RETURNING id, status
        `;

        const result = await client.query(query, [
            userId,
            amount,
            ORDER_STATUS.PENDING
        ]);

        // commit transaction
        await client.query('COMMIT');

        await publishEvent(EVENT_TYPES.ORDER_CREATED, {
            orderId: result.rows[0].id,
            userId,
            amount,
        });

        return res.status(201).json({
            message: 'Order created successfully',
            order: result.rows[0]
        });
    } catch (err) {
        await client.query("ROLLBACK");
        next(err);
    } finally{
        client.release();
    }
};

// get orders
export const getOrders = async (req, res, next)=>{
    try {
        const { userId, role } = req.user;
        
        let query;
        let values;

        if(role == 'ADMIN'){
            query = "SELECT * FROM orders ORDER BY created_at DESC";
            values = [];
        } else{
            query = `
                SELECT * FROM orders
                WHERE user_id = $1
                ORDER BY created_at DESC
            `;

            values = [ userId ];
        }

        const result = await pool.query(query, values);
        
        res.status(200).json({ order: result.rows });
    } catch (err) {
        next(err);
    }
};

// get orders By Id
export const getOrderById = async (req, res, next)=>{
    try {
        const { userId, role } = req.user;
        const orderId = req.params.id;

        let query;
        let values;
        
        if(role === 'ADMIN'){
            query = "SELECT * FROM orders WHERE id = $1";
            values = [ orderId ];
        } else{
            query = `
                SELECT * FROM orders
                WHERE id = $1 AND user_id = $2
            `;
            values = [orderId, userId];
        }

        const result = await pool.query(query, values);

        if(result.rows.length === 0){
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order: result.rows[0] });
    } catch (err) {
        next(err);
    }
};