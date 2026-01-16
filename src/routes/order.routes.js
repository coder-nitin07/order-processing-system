import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';
import { createOrder, getOrderById, getOrders } from '../auth/order.controller.js';
const orderRouter = express.Router();

orderRouter.post('/createOrder', authenticate, authorizeRoles('USER'), createOrder);
orderRouter.get('/getOrder', authenticate, getOrders);
orderRouter.get('/getOrder/:id', authenticate, getOrderById);

export default orderRouter;