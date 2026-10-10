import "dotenv/config";
import request from "supertest";
import { describe, it, expect } from "@jest/globals";

describe("Moderator Authentication", () => {
  const email = `test-${Date.now()}@whistledrop.com`;
  const password = "TestPassword123!";

  let token: string;

  it(
    "should register a new moderator",
    async () => {
      const response = await request("http://localhost:5000")
        .post("/api/auth/register")
        .send({
          email,
          password,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.email).toBe(email);
      expect(response.body.data.role).toBe("MODERATOR");
    },
    30000
  );

  it(
    "should login the moderator and return a JWT",
    async () => {
      const response = await request("http://localhost:5000")
        .post("/api/auth/login")
        .send({
          email,
          password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");

      token = response.body.data.token;

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(20);
    },
    30000
  );

  it(
    "should reject access to /me without a token",
    async () => {
      const response = await request("http://localhost:5000")
        .get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    },
    30000
  );

  it(
    "should allow access to /me with a valid JWT",
    async () => {
      const response = await request("http://localhost:5000")
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("moderator");
      expect(response.body.data.moderator.email).toBe(email);
    },
    30000
  );
});