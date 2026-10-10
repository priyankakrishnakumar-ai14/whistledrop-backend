import "dotenv/config";
import request from "supertest";
import { describe, it, expect } from "@jest/globals";

describe("Moderator Report Management", () => {
  const email = `moderator-test-${Date.now()}@whistledrop.com`;
  const password = "TestPassword123!";

  let token: string;
  let reportId: string;

  it(
    "should create a test moderator and login",
    async () => {
      const registerResponse = await request("http://localhost:5000")
        .post("/api/auth/register")
        .send({
          email,
          password,
        });

      expect(registerResponse.status).toBe(201);

      const loginResponse = await request("http://localhost:5000")
        .post("/api/auth/login")
        .send({
          email,
          password,
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);

      token = loginResponse.body.data.token;

      expect(token).toBeTruthy();
    },
    30000
  );

  it(
    "should create a report for moderator testing",
    async () => {
      const response = await request("http://localhost:5000")
        .post("/api/reports")
        .send({
          category: "TECHNICAL",
          description:
            "Automated test report for moderator management workflow.",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      reportId = response.body.data.reportId;

      expect(reportId).toBeTruthy();
      expect(response.body.data.status).toBe("SUBMITTED");
    },
    30000
  );

  it(
    "should reject moderator report access without authentication",
    async () => {
      const response = await request("http://localhost:5000")
        .get("/api/moderator/reports");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    },
    30000
  );

  it(
    "should allow authenticated moderator to list reports",
    async () => {
      const response = await request("http://localhost:5000")
        .get("/api/moderator/reports")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      const testReport = response.body.data.find(
        (report: { id: string }) => report.id === reportId
      );

      expect(testReport).toBeDefined();

      // Security check: case-code hash must never be exposed.
      expect(testReport).not.toHaveProperty("caseCodeHash");
    },
    30000
  );

  it(
    "should move the report from SUBMITTED to UNDER_REVIEW",
    async () => {
      const response = await request("http://localhost:5000")
        .patch(`/api/moderator/reports/${reportId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "UNDER_REVIEW",
          message: "Moderator started reviewing the report.",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("UNDER_REVIEW");
      expect(response.body.data.closedAt).toBeNull();
    },
    30000
  );

  it(
    "should move the report from UNDER_REVIEW to RESOLVED",
    async () => {
      const response = await request("http://localhost:5000")
        .patch(`/api/moderator/reports/${reportId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "RESOLVED",
          message: "Report investigation completed.",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("RESOLVED");
      expect(response.body.data.closedAt).not.toBeNull();
    },
    30000
  );

  it(
    "should reject an invalid status transition",
    async () => {
      const response = await request("http://localhost:5000")
        .patch(`/api/moderator/reports/${reportId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "UNDER_REVIEW",
          message: "This transition should not be allowed.",
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "Invalid status transition"
      );
    },
    30000
  );
});