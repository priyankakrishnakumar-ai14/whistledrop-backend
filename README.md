<h1 align="center">🔔 WhistleDrop</h1>

<h3 align="center">Speak Without Being Seen.</h3>

<p align="center">
  Secure reporting. Confidential tracking. Accountable resolution.<br/>
  A privacy-conscious backend where anyone can raise a concern, follow it with a single code,<br/>
  and trust that it moves through a real review process.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strictly%20Typed-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="OpenAPI" />
  <img src="https://img.shields.io/badge/Tests-14%20passing-brightgreen?style=flat-square&logo=jest&logoColor=white" alt="Tests" />
</p>

<p align="center">
  <sub>Built by <a href="https://github.com/priyankakrishnakumar-ai14"><b>Priyanka Krishnakumar</b></a> · GDG Recruitment · Backend Development Task</sub>
</p>

---

## 💡 Why I Built This

Most people who witness something wrong stay quiet, not because they don't care, but because reporting feels risky, complicated, or pointless. Forms ask for accounts. Accounts ask for identity. And once a report is sent, it disappears into silence.

I wanted to design a backend that removes all three barriers:

- **No account needed** to submit a report.
- **One case code** to follow the report's progress, with no login.
- **A strict review workflow** so every report is handled, not just received.

That idea became **WhistleDrop**.

---

## ✨ What It Does

| Capability               | How it works                                           |
| ------------------------ | ------------------------------------------------------ |
| 📨 Report submission      | Accepts reports without requiring a reporter account   |
| 🔎 Case tracking          | Uses a generated case code to retrieve report progress |
| 🛡️ Moderator authentication | Argon2 password hashing and JWT-based access         |
| 🗂️ Report management      | Protected endpoints for moderator operations           |
| 🔁 Status workflow        | Validates permitted report status transitions          |
| ✅ Request validation     | Zod validates incoming data at the API boundary        |
| 🚦 API protection         | Security middleware and rate limiting                  |
| 🗄️ Data persistence       | PostgreSQL with Prisma ORM                             |
| 📖 API documentation      | Interactive Swagger / OpenAPI docs                     |
| 🧪 Automated verification | Jest and Supertest                                     |

---

## 🧭 The Journey of a Report

```text
  Reporter                         WhistleDrop                         Moderator
     │                                  │                                  │
     │── POST /api/reports ───────────▶ │                                  │
     │◀──────── case code (shown once) ─│                                  │
     │                                  │  stores only the HASH of the code│
     │                                  │                                  │
     │── GET /api/track/{caseCode} ───▶ │                                  │
     │◀──────── current status ─────────│                                  │
     │                                  │◀── PATCH .../status (JWT) ───────│
     │                                  │    transition validated          │
```

The reporter never creates an account. The moderator never sees who the reporter is. The database never stores the plaintext case code.

---

## 🏗️ System Architecture

A layered request flow keeps HTTP handling, validation, application logic, and storage cleanly separated.

```text
                    CLIENT
                      │
                      ▼
               EXPRESS API
                      │
                      ▼
             SECURITY MIDDLEWARE
          Helmet │ Rate Limiting │ CORS
                      │
                      ▼
           ROUTES AND VALIDATION  (Zod)
                      │
                      ▼
            APPLICATION LOGIC  (services)
                      │
                      ▼
                 PRISMA ORM
                      │
                      ▼
                 POSTGRESQL
```

Authentication middleware guards moderator operations, and centralized error handling keeps every failure response consistent.

### Technology Stack

| Layer             | Technology        | Why I chose it                          |
| ----------------- | ----------------- | --------------------------------------- |
| Runtime           | Node.js           | Fast, familiar server-side execution    |
| API framework     | Express           | Simple, flexible routing                |
| Language          | TypeScript        | Type safety across the whole codebase   |
| Database          | PostgreSQL        | Reliable relational storage             |
| ORM               | Prisma            | Typed queries and schema migrations     |
| Validation        | Zod               | Schema-based request validation         |
| Authentication    | JSON Web Tokens   | Stateless moderator access              |
| Password hashing  | Argon2            | Modern, memory-hard password protection |
| API specification | Swagger / OpenAPI | Explore and test without a frontend     |
| Testing           | Jest, Supertest   | Unit and HTTP-level verification        |

---

## 🔄 Report Lifecycle

Every report follows a defined workflow, and the application rejects any invalid jump.

```text
                   SUBMITTED
                       │
                       ▼
                  UNDER_REVIEW
                   ╱        ╲
                  ▼          ▼
              RESOLVED    DISMISSED
```

Submission and review are separate stages, and `RESOLVED` and `DISMISSED` are terminal. A report can't skip review, and a closed report can't quietly reopen.

---

## 🔐 Security and Privacy

Security is handled at several points in the request lifecycle, not in one place.

**Case-code protection**
Case codes are hashed before storage, so a submitted code can be verified without the plaintext ever sitting in the database. The generated code works like a bearer credential and should be kept confidential.

**Moderator authentication**
Passwords are hashed with Argon2. JWTs gate every protected moderator endpoint.

**Input validation**
Zod rejects malformed or unexpected input before it reaches application logic.

**API protection**
Helmet, CORS configuration, and rate limiting reduce common API abuse.

**Centralized error handling**
Validation failures, authentication errors, missing reports, and invalid workflow transitions all return consistent responses.

**Secret management**
Database credentials and JWT secrets live in environment variables, never in source control.

> **Privacy boundary:** Anonymous here means no reporter account is required. It doesn't by itself guarantee that IP addresses or other metadata are never collected by the application, hosting provider, or infrastructure. I've tried to be honest about what the system does and doesn't promise.

---

## 📡 API Reference

Interactive docs: **`http://localhost:5000/api-docs`** (start the server first)

| Method  | Endpoint                             | Access    | Description                          |
| ------- | ------------------------------------ | --------- | ------------------------------------ |
| `GET`   | `/health`                            | Public    | Check API health                     |
| `POST`  | `/api/reports`                       | Public    | Submit a report                      |
| `GET`   | `/api/track/{caseCode}`              | Public    | Retrieve report progress             |
| `POST`  | `/api/auth/register`                 | Public    | Register a moderator                 |
| `POST`  | `/api/auth/login`                    | Public    | Authenticate a moderator             |
| `GET`   | `/api/auth/me`                       | Moderator | Retrieve the authenticated moderator |
| `GET`   | `/api/moderator/reports`             | Moderator | List reports                         |
| `GET`   | `/api/moderator/reports/{id}`        | Moderator | Retrieve report details              |
| `PATCH` | `/api/moderator/reports/{id}/status` | Moderator | Update report status                 |

Request schemas and response formats are documented in Swagger.

### ⚡ Try It in a Minute

1. Start the server and open `/api-docs`.
2. Submit a report with `POST /api/reports` and **copy the case code**.
3. Check it with `GET /api/track/{caseCode}`. The status will be `SUBMITTED`.
4. Register and log in as a moderator, then click **Authorize** with your JWT.
5. Move the report to `UNDER_REVIEW`, then to `RESOLVED` or `DISMISSED`.
6. Track it again with the same case code and watch the status change.
7. Try an illegal jump, like `SUBMITTED` straight to `RESOLVED`, and watch the workflow rules reject it.

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A PostgreSQL database
- A `.env` file with your database URL and JWT secret

### 1. Clone the repository

```bash
git clone https://github.com/priyankakrishnakumar-ai14/whistledrop.git
cd whistledrop
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure the environment

Create a `.env` file in the project root with your database connection and JWT secret. Never commit `.env` or share real credentials.

### 4. Prepare the database

Apply the existing Prisma migrations using the migration command for your configured Prisma version.

### 5. Start the development server

```bash
npm run dev
```

### 6. Explore the API

Open `http://localhost:5000/api-docs`.

---

## 🧪 Testing and Build Verification

```bash
npm test        # run the automated test suite
npm run build   # compile the TypeScript application
```

Current status: **5 test suites, 14 tests, all passing.**

---

## 📁 Project Structure

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

---

## 🧠 Engineering Decisions

**Reporter and moderator are separate worlds.**
Submitting and tracking use a completely different access model from moderation, so nobody needs an account just to raise a concern.

**Hash the case code, not just the password.**
The case code is effectively a key to a report, so I treated it like a credential and store only its hash.

**Make the workflow a rule, not a convention.**
Status transitions are enforced in code. Consistency doesn't depend on moderators remembering the process.

**Validate at the boundary.**
Bad data is stopped at the door instead of being cleaned up deep inside the logic.

**Document it so it can be tested.**
Swagger lets anyone evaluate the whole API without needing a frontend.

---


## 🎯 Project Goals

WhistleDrop makes reporting easier to start, case progress easier to follow, and moderation more structured.

**Privacy-conscious access. Structured workflows. Accountable handling.**

---

<p align="center">
  <b>WhistleDrop</b> · Speak Without Being Seen<br/>
  Designed and built by <a href="https://github.com/priyankakrishnakumar-ai14">Priyanka Krishnakumar</a> for the GDG Backend Development recruitment task.
</p>
