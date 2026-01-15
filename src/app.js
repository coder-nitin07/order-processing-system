import express from 'express';
import healthRouter from './health/health.route.js';
const app = express();

app.use(express.json());

// health route
app.use('/health', healthRouter);

export default app;