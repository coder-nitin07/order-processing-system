import express from 'express';
import { register } from './auth.controller';
const authRouter = express.Router();

authRouter.post('/register', register);

export default authRouter;