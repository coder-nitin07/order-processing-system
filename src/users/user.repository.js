import pool from '../database/postgres.js';

export async function findUserByEmail(email){
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [ email ]
    );

    return result.rows[0];
};

export async function createUser({ email, password, role }){
    const result = await pool.query(
        `INSERT INTO users (email, password, role)
        VALUES ($1, $2, $3)
        RETURNING id, email, role, created_at`,
        [ email, password, role ]
    );

    return result.rows[0];
};