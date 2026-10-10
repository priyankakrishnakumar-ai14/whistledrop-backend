
import "dotenv/config";
import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../src/app";

describe("Health Check", () => {
  it("should return 200 and confirm the server is running", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "WhistleDrop backend is running"
    );
  });
});