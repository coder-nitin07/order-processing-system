import { Worker } from "bullmq";
import nodemailer from 'nodemailer';
import { connectRedis } from "../config/redis.js";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

new Worker(
    'email-queue',
    async (job)=>{
        const { email, orderId } = job.data;

        await transporter.sendMail({
            from: '"Order App" <no-reply@orderapp.com>',
            to: email,
            subject: 'Order Confirmed',
            text: `Your order ${ orderId } is confirmed`
        });

        console.log("EMal send", email);
    },
    { connection: connectRedis }
); 