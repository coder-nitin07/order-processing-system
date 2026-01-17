import app from './app.js';
import { env } from './config/env.js';
import { connectPostgres } from './database/postgres.js';
import { connectRedis } from './config/redis.js';
import http from "http";
import { initOrderCreatedListener } from './events/orderCreated.listener.js';
import { initWebSocket } from './sockets/socket.server.js';

const server = http.createServer(app);

async function startServer() {
    try {
        await connectPostgres();
        await connectRedis();
        await initOrderCreatedListener();

        initWebSocket(server);

        app.listen(env.port, ()=>{
            console.log(`Server is running on PORT ${ env.port }`);
        });
    } catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();