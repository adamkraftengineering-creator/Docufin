# 📄 Docufin — Multi-Tenant Financial Document Management Platform

Docufin is an enterprise-grade, multi-tenant document management application built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Sequelize ORM**. 

The platform is engineered around strict tenant data isolation, SOLID design principles, fail-fast environment security, and end-to-end type safety.

---

## 🏗 Architecture & Design Principles

```text
  ┌──────────────────────────────────────────────────────────┐
  │                   PostgreSQL Database                    │
  │                      (docu_workspace)                    │
  ├───────────────────┬───────────────────┬──────────────────┤
  │      Tenants      │       Users       │    Documents     │
  │  (Acme, Beta...)  │ (test1@, test2@)  │  (Tax, Audit...) │
  └─────────┬─────────┴─────────┬─────────┴────────┬─────────┘
            │                   │                  │
            └─── tenant_id ─────┴─── tenant_id ────┘
```

### 1. Multi-Tenant Data Isolation
Docufin employs a shared-database, shared-schema architecture where every database record is bound to a `tenant_id`. 
* Upon authentication, the backend issues a signed JSON Web Token (JWT) containing both `userId` and `tenantId`.
* Middleware intercepts incoming requests, verifies the JWT, and extracts `req.user.tenantId`.
* Service queries automatically force `WHERE tenant_id = req.user.tenantId`, preventing cross-tenant data access at the database level.

### 2. Cryptographic Security & IDOR Prevention (UUID v4)
All entities (`Tenants`, `Users`, `Documents`) use **UUID v4 primary keys** instead of auto-incrementing integers:
* **IDOR Attack Mitigation:** Unguessable 128-bit identifiers prevent URL parameter tampering (e.g., changing `/documents/104` to `/documents/103`).
* **Business Metric Obfuscation:** Prevents competitors or external users from enumerating system volume or user counts.
* **Distributed Readiness:** Enables client-side or microservice ID generation without database collisions.

### 3. Fail-Fast Environment Validation
To eliminate insecure hardcoded fallbacks in production code, environment variables are strictly validated at boot time in `src/config/env.ts`. If required variables (`DATABASE_URL`, `JWT_SECRET`) are missing or empty, the application halts immediately with a fatal config error.

### 4. SOLID Clean Layered Architecture
The codebase strictly adheres to the Single Responsibility Principle (SRP):
* **`types/`**: Pure TypeScript contracts and DTO interfaces.
* **`models/`**: Sequelize database schemas and entity associations.
* **`services/`**: Business logic, password hashing (`bcrypt`), and ORM queries.
* **`controllers/`**: HTTP request parsing and response delivery.
* **`utils/asyncHandler.ts`**: Higher-order function that catches service errors globally, eliminating boilerplate `try/catch` blocks in controllers.

---

## 🛠 Tech Stack

* **Language:** TypeScript (v5.x)
* **Runtime:** Node.js (v20+)
* **Framework:** Express.js
* **Database:** PostgreSQL
* **ORM:** Sequelize
* **Authentication:** JWT (JSON Web Tokens) & BcryptJS
* **Dev Tooling:** `ts-node-dev`, `ts-node`

---

## 📁 Repository Structure

```text
backend/
├── src/
│   ├── config/             # Database connection & env validation
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/        # Express route handlers
│   │   ├── authController.ts
│   │   └── documentController.ts
│   ├── middleware/         # JWT authentication middleware
│   │   └── authMiddleware.ts
│   ├── models/             # Sequelize models (Tenant, User, Document)
│   │   ├── tenantModel.ts
│   │   ├── userModel.ts
│   │   ├── documentModel.ts
│   │   └── index.ts
│   ├── routes/             # API Endpoint definitions
│   │   ├── authRoutes.ts
│   │   ├── documentRoutes.ts
│   │   └── index.ts
│   ├── services/           # Business logic & Database layer
│   │   ├── authService.ts
│   │   └── documentService.ts
│   ├── types/              # TypeScript interface definitions
│   │   ├── authTypes.ts
│   │   ├── documentTypes.ts
│   │   ├── commonTypes.ts
│   │   └── index.ts
│   ├── utils/              # Async wrapper & error handlers
│   │   └── asyncHandler.ts
│   ├── seed.ts             # Database seeder script
│   └── server.ts           # Express application entry point
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start & Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **PostgreSQL** running locally on port `5432`

### 1. Database Creation
Ensure PostgreSQL is running and create a local database:
```sql
CREATE DATABASE docu_workspace;
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=4000
DATABASE_URL=postgres://postgres:1623@localhost:5432/docu_workspace
JWT_SECRET=super_secret_jwt_key_2026
```

### 3. Installation & Database Seeding
From the `backend/` directory, run:

```powershell
# Install dependencies
npm install

# Seed database tables and sample multi-tenant data
npm run seed
```

### 4. Run Development Server
```powershell
npm run dev
```
The server will start on `http://localhost:4000`.

---

## 🧪 Sample Test Credentials

The seeder populates two distinct tenants to demonstrate data isolation:

| User Email | Password | Tenant Workspace | Sample Documents |
| :--- | :--- | :--- | :--- |
| `test1@offerzen.com` | `password123` | **Acme Accounting** | 2026 Q1 Tax Return, Audit Report, Payroll Summary |
| `test2@offerzen.com` | `password123` | **Beta Finance** | Beta Financial Plan |

---

## 🔌 API Reference

### Auth Endpoints

#### `POST /api/auth/login`
Authenticates a user and returns a tenant-scoped JWT token.

* **Request Body:**
  ```json
  {
    "email": "test1@offerzen.com",
    "password": "password123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "token": "<JWT_TOKEN_STRING>",
    "user": {
      "id": "e4a282f1-332d-4530-9b34-cb2d9f3f4e2f",
      "email": "test1@offerzen.com",
      "tenantId": "c89b7b62-1a4f-4d92-bf39-2a07c3dfd3b2"
    }
  }
  ```

---

### Document Endpoints *(Requires `Authorization: Bearer <JWT_TOKEN>`)*

#### `GET /api/documents`
Retrieves all documents belonging to the authenticated user's tenant.

* **Query Parameters:** `q` (optional string search for document titles)
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "8f1a4e3b-9b8a-4d7c-8e2f-1a3b5c7d9e2f",
      "tenant_id": "c89b7b62-1a4f-4d92-bf39-2a07c3dfd3b2",
      "title": "2026 Q1 Tax Return",
      "status": "signed",
      "created_at": "2026-08-13T12:00:00.000Z",
      "updated_at": "2026-08-13T12:00:00.000Z"
    }
  ]
  ```

#### `POST /api/documents`
Creates a new document scoped to the authenticated user's tenant.

* **Request Body:**
  ```json
  {
    "title": "Q3 Operating Budget"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "id": "1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
    "tenant_id": "c89b7b62-1a4f-4d92-bf39-2a07c3dfd3b2",
    "title": "Q3 Operating Budget",
    "status": "draft",
    "created_at": "2026-08-13T17:00:00.000Z",
    "updated_at": "2026-08-13T17:00:00.000Z"
  }
  ```

#### `PATCH /api/documents/:id/status`
Updates the status of an existing tenant document.

* **Request Body:**
  ```json
  {
    "status": "awaiting_signature"
  }
  ```
* **Success Response (200 OK)**

---

## 🛡 License

This project is open-source and available under the [MIT License](LICENSE).