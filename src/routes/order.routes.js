import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';
import { createOrder } from '../auth/order.controller.js';
const orderRouter = express.Router();

orderRouter.post('/createOrder', authenticate, authorizeRoles('USER'), createOrder);

export default orderRouter;