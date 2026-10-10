# WhistleDrop

### Secure Reporting. Confidential Tracking. Accountable Resolution.

<p align="center">
  A privacy-conscious reporting backend designed to simplify report submission,<br/>
  enable case-code-based tracking, and support structured moderator workflows.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strictly%20Typed-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="OpenAPI" />
</p>

---

## Overview

Reporting systems are most useful when people can submit concerns without unnecessary friction, follow up without creating an account, and trust that submitted cases follow a defined review process.

**WhistleDrop** is a backend API built around these requirements. It supports anonymous report submission, case-code-based tracking, moderator authentication, and controlled status updates. Its architecture combines typed application code, request validation, database persistence, security middleware, and interactive API documentation.

The objective is to provide a maintainable foundation for a reporting system in which privacy-conscious access and accountable case handling are central design considerations.

## Core Capabilities

| Capability               | Implementation                                         |
| ------------------------ | ------------------------------------------------------ |
| Report submission        | Accepts reports without requiring a reporter account   |
| Case tracking            | Uses a generated case code to retrieve report progress |
| Moderator authentication | Supports password hashing and JWT-based authentication |
| Report management        | Provides protected endpoints for moderator operations  |
| Status workflow          | Validates permitted report status transitions          |
| Request validation       | Uses Zod to validate incoming data                     |
| API protection           | Uses security middleware and rate limiting             |
| Data persistence         | Uses PostgreSQL with Prisma ORM                        |
| API documentation        | Provides interactive Swagger / OpenAPI documentation   |
| Automated verification   | Uses Jest and Supertest                                |

## System Architecture

The application follows a layered request-processing flow, separating HTTP handling, validation, application logic, and persistent storage.

```text
                    CLIENT
                      |
                      v
               EXPRESS API
                      |
                      v
             SECURITY MIDDLEWARE
          Helmet | Rate Limiting | CORS
                      |
                      v
           ROUTES AND VALIDATION
                      |
                      v
            APPLICATION LOGIC
                      |
                      v
                 PRISMA ORM
                      |
                      v
                 POSTGRESQL
```

Authentication middleware protects moderator operations where required. Centralized error handling provides a consistent approach to invalid requests and application failures.

### Technology Stack

| Layer             | Technology        | Purpose                               |
| ----------------- | ----------------- | ------------------------------------- |
| Runtime           | Node.js           | Server-side execution                 |
| API framework     | Express           | Routing and request handling          |
| Language          | TypeScript        | Type-safe application development     |
| Database          | PostgreSQL        | Persistent storage                    |
| ORM               | Prisma            | Database access and schema management |
| Validation        | Zod               | Request validation                    |
| Authentication    | JSON Web Tokens   | Authenticated moderator access        |
| Password hashing  | Argon2            | Password protection                   |
| API specification | Swagger / OpenAPI | API exploration and documentation     |
| Testing           | Jest, Supertest   | Automated testing                     |

## Report Lifecycle

Reports move through a defined workflow. Invalid status transitions are rejected by the application.

```text
                   SUBMITTED
                       |
                       v
                  UNDER_REVIEW
                   /        \
                  v          v
              RESOLVED    DISMISSED
```

This workflow separates initial submission from moderator review and terminal outcomes. It also provides a clear model for validating state changes.

## Security and Privacy

Security is addressed at multiple points in the request lifecycle.

**Case-code protection**

The tracking implementation hashes case codes before storing them, allowing a submitted code to be checked without retaining its plaintext value in the database. The generated code should be treated as a confidential bearer credential.

**Moderator authentication**

Moderator passwords are hashed using Argon2. JWT-based authentication supports access to protected moderator endpoints.

**Input validation**

Zod validates incoming request data to help reject malformed or unexpected input before it reaches application logic.

**API protection**

Security middleware, rate limiting, and controlled access to moderator endpoints help reduce common API abuse.

**Error handling**

Centralized error handling provides consistent responses for validation failures, authentication errors, missing reports, and invalid workflow transitions.

**Secret management**

Sensitive configuration is supplied through environment variables. Database credentials and JWT secrets must not be committed to source control.

> **Privacy boundary:** Anonymous reporting means a reporter account is not required. It does not, by itself, guarantee that IP addresses or other identifying metadata are never collected by the application, hosting provider, or infrastructure.

## API Reference

The interactive API documentation is available at:

**Local URL:** `http://localhost:5000/api-docs`

Start the server before opening this URL.

| Method  | Endpoint                             | Description                          |
| ------- | ------------------------------------ | ------------------------------------ |
| `GET`   | `/health`                            | Check API health                     |
| `POST`  | `/api/reports`                       | Submit a report                      |
| `GET`   | `/api/track/{caseCode}`              | Retrieve report progress             |
| `POST`  | `/api/auth/register`                 | Register a moderator                 |
| `POST`  | `/api/auth/login`                    | Authenticate a moderator             |
| `GET`   | `/api/auth/me`                       | Retrieve the authenticated moderator |
| `GET`   | `/api/moderator/reports`             | List reports                         |
| `GET`   | `/api/moderator/reports/{id}`        | Retrieve report details              |
| `PATCH` | `/api/moderator/reports/{id}/status` | Update report status                 |

Authentication requirements, request schemas, and response formats are defined in the API documentation.

## Getting Started

### Prerequisites

- Node.js and npm
- Access to a PostgreSQL database
- Environment variables required by the application

### 1. Clone the repository

```bash
git clone <https://github.com/priyankakrishnakumar-ai14>
cd whistledrop
```

Replace the placeholder with the actual repository URL.

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure the environment

Create a `.env` file in the project root and configure the database connection and JWT secret required by the application.

Do not commit `.env` or expose real credentials in documentation, screenshots, or version control.

### 4. Prepare the database

Apply the project's existing Prisma migrations using the migration commands appropriate for its configured Prisma version and environment.

### 5. Start the development server

```bash
npm run dev
```

### 6. Explore the API

Open `http://localhost:5000/api-docs` in your browser to inspect available endpoints and their request and response formats.

## Testing and Build Verification

Run the automated test suite:

```bash
npm test
```

Compile the TypeScript application:

```bash
npm run build
```

The current development run completed with **5 passing test suites and 14 passing tests**. Re-run both commands after the final changes to verify the version being submitted.

## Project Structure

```text
whistledrop/
├── prisma/          # Database schema and migrations
├── scripts/         # Utility scripts
├── src/
│   ├── config/      # Application configuration
│   ├── controllers/ # HTTP request handlers
│   ├── middleware/  # Authentication and shared middleware
│   ├── routes/      # API route definitions
│   ├── services/    # Application logic
│   ├── validators/  # Request validation
│   ├── app.ts       # Express application
│   └── server.ts    # Server entry point
├── tests/           # Automated tests
├── prisma.config.ts
├── package.json
└── README.md
```

Adjust the structure above if the actual repository differs.

## Engineering Decisions

**Reporter and moderator separation**

Report submission and tracking use a different access model from moderator administration. This avoids requiring a reporter account simply to submit or follow up on a concern.

**Case-code-based tracking**

A generated reference provides a way to retrieve case progress without requiring conventional user-account access.

**Explicit workflow rules**

Status transitions are defined and validated, helping keep report handling consistent and predictable.

**Validation at API boundaries**

Validating incoming data at the API boundary reduces the chance of malformed data propagating into application logic.

**Interactive documentation**

Swagger makes the API easier to inspect, test, and evaluate without requiring a separate frontend.

## Future Improvements

Potential areas for further development include:

- Expanded role-based permissions and administrative controls
- More comprehensive audit history and moderator accountability
- Additional integration and security testing
- Deployment automation, monitoring, and operational alerting
- Documented data-retention and privacy policies
- Further abuse prevention and operational hardening

These items represent possible improvements and should not be interpreted as features already implemented.

## Project Goals

WhistleDrop aims to make reporting easier to access and case progress easier to follow while giving moderators a structured way to manage submissions.

Its design emphasizes three principles:

**Privacy-conscious access. Structured workflows. Accountable handling.**

---

<p align="center">
  <strong>WhistleDrop</strong><br/>
  A secure, maintainable foundation for structured reporting.
</p>
