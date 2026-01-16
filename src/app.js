import express from 'express';
import healthRouter from './health/health.route.js';
import authRouter from './auth/auth.routes.js';
const app = express();

app.use(express.json());

// health route
app.use('/health', healthRouter);

// routes
app.use('/auth', authRouter);




import { authenticate, authorizeRoles } from "./middlewares/auth.middleware.js";

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

app.get(
  "/admin-only",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default app;