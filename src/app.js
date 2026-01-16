import express from 'express';
import healthRouter from './health/health.route.js';
import authRouter from './auth/auth.routes.js';
import orderRouter from './routes/order.routes.js';
const app = express();

app.use(express.json());

// health route
app.use('/health', healthRouter);

// routes
app.use('/auth', authRouter);
app.use('/order', orderRouter);

export default app;