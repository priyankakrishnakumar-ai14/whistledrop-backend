import "dotenv/config";
import request from "supertest";
import { describe, it, expect } from "@jest/globals";

describe("Anonymous Report Submission", () => {
  it(
    "should create a report and return a secure case code",
    async () => {
      const response = await request("http://localhost:5000")
        .post("/api/reports")
        .send({
          category: "TECHNICAL",
          description:
            "Automated test report for WhistleDrop submission flow.",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveProperty("reportId");
      expect(response.body.data).toHaveProperty("caseCode");
      expect(response.body.data.status).toBe("SUBMITTED");

      expect(response.body.data.caseCode).toMatch(
        /^WD-[A-Z0-9]{4}-[A-Z0-9]{4}$/
      );
    },
    30000
  );
});