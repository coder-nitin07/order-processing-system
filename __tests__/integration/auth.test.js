import request from "supertest";
import app from "../../app.js";
import pool from "../../database/postgres.js";

describe("Auth Routes", () => {

    const testUser = {
        email: "testuser@example.com",
        password: "Test@1234"
    };

    afterAll(async () => {
        // clean up test user from DB
        await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
        await pool.end();
    });

    it("should register a user", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    it("should login the user", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send(testUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

});
