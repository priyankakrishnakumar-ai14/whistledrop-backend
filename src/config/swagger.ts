import { OpenAPIV3 } from "openapi-types";

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "WhistleDrop API",
    version: "1.0.0",
    description:
      "Secure anonymous reporting and case tracking backend.",
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "Server is running",
          },
        },
      },
    },

    "/api/reports": {
      post: {
        summary: "Submit an anonymous report",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category", "description"],
                properties: {
                  category: {
                    type: "string",
                    enum: [
                      "SECURITY",
                      "HARASSMENT",
                      "CORRUPTION",
                      "TECHNICAL",
                      "OTHER",
                    ],
                  },
                  description: {
                    type: "string",
                    minLength: 10,
                    maxLength: 5000,
                  },
                  evidenceUrl: {
                    type: "string",
                    format: "uri",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Report submitted successfully",
          },
          "400": {
            description: "Validation error",
          },
        },
      },
    },

    "/api/track/{caseCode}": {
      get: {
        summary: "Track a report using its case code",
        parameters: [
          {
            name: "caseCode",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "WD-ABCD-2345",
            },
          },
        ],
        responses: {
          "200": {
            description: "Report tracking information",
          },
          "404": {
            description: "Invalid case code",
          },
        },
      },
    },

    "/api/auth/register": {
      post: {
        summary: "Register a moderator",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  password: {
                    type: "string",
                    minLength: 8,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Moderator created",
          },
          "409": {
            description: "Moderator already exists",
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        summary: "Moderator login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  password: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "JWT returned",
          },
          "401": {
            description: "Invalid credentials",
          },
        },
      },
    },

    "/api/auth/me": {
      get: {
        summary: "Get authenticated moderator",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Authenticated moderator",
          },
          "401": {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/moderator/reports": {
      get: {
        summary: "List reports",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Reports retrieved successfully",
          },
          "401": {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/moderator/reports/{id}": {
      get: {
        summary: "Get a report by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Report details",
          },
          "404": {
            description: "Report not found",
          },
        },
      },
    },

    "/api/moderator/reports/{id}/status": {
      patch: {
        summary: "Update report status",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: [
                      "UNDER_REVIEW",
                      "RESOLVED",
                      "DISMISSED",
                    ],
                  },
                  message: {
                    type: "string",
                    maxLength: 1000,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Status updated successfully",
          },
          "409": {
            description: "Invalid status transition",
          },
        },
      },
    },
  },
};