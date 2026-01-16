import pool from '../database/postgres.js';
import ORDER_STATUS from "../constants/orderStatus.js";
import { createOrderSchema } from "../validators/order.validator.js";

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