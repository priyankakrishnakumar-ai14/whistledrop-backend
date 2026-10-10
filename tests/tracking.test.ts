import "dotenv/config";
import request from "supertest";
import { describe, it, expect } from "@jest/globals";

describe("Report Tracking", () => {
  it(
    "should allow a reporter to track a report using the case code",
    async () => {
      const createResponse = await request("http://localhost:5000")
        .post("/api/reports")
        .send({
          category: "TECHNICAL",
          description:
            "Automated test report for tracking functionality.",
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);

      const caseCode = createResponse.body.data.caseCode;

      expect(caseCode).toMatch(
        /^WD-[A-Z0-9]{4}-[A-Z0-9]{4}$/
      );

      const trackResponse = await request("http://localhost:5000")
        .get(`/api/track/${caseCode}`);

      expect(trackResponse.status).toBe(200);
      expect(trackResponse.body.success).toBe(true);

      expect(trackResponse.body.data).toHaveProperty("id");
      expect(trackResponse.body.data).toHaveProperty("category");
      expect(trackResponse.body.data).toHaveProperty("status");

      expect(trackResponse.body.data.status).toBe("SUBMITTED");

      expect(trackResponse.body.data).not.toHaveProperty(
        "caseCodeHash"
      );
    },
    30000
  );
});