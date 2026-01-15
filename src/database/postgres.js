import pkg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: env.databaseUrl
});

export async function connectPostgres() {
    try {
        await pool.query('SELECT 1');
        console.log(`PostgreSQL Connected`);
    } catch (error) {
        console.error(`PostgreSQL connection failed`);
        throw error;
    }
}

export default pool;