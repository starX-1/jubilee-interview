# Jubilee Insurance - Claims Tracker Application

A clean, production-ready Full Stack Insurance Claims Tracking web application developed for **Jubilee Insurance Kenya** customer service and claims officers.

![Jubilee Insurance Branding](https://jubileeinsurance.com/ke/wp-content/themes/jubilee/assets/favicon.png)

---

## 📋 Table of Contents
- [Prerequisites](#-prerequisites)
- [Project Architecture](#-project-architecture)
- [Installation & Setup](#-installation--setup)
- [Database Setup & Migrations](#-database-setup--migrations)
- [How to Run Frontend & Backend](#-how-to-run-frontend--backend)
- [Minimum API Specification](#-minimum-api-specification)
- [Key Assumptions Made](#-key-assumptions-made)

---

## ⚙️ Prerequisites

Before setting up and running the application, ensure you have the following installed on your environment:

- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)
- **PostgreSQL Database**: A running PostgreSQL instance or a [Neon DB](https://neon.tech/) cloud database cluster.
- **Git**: For version control.

---

## 🏗️ Project Architecture

The repository is structured into two clean, independent packages (`backend/` and `frontend/`), adhering to a layered MVC / Service architecture:

```
jubilee-interview/
├── backend/                  # Node.js & Express REST API Server
│   ├── .env.example          # Environment variables template
│   ├── src/
│   │   ├── config/           # Database pool (Neon DB) & environment config
│   │   ├── controllers/      # HTTP request/response handlers
│   │   ├── models/           # PostgreSQL data queries
│   │   ├── routes/           # Express router & Zod schema definitions
│   │   ├── middleware/       # Validation & error handling middleware
│   │   ├── services/         # Business logic (auto claim # generator)
│   │   ├── app.js            # Express app configuration & middleware
│   │   ├── server.js         # HTTP server entrypoint
│   │   └── seed.js           # Database seeding runner
│   └── package.json
│
├── frontend/                 # React 18 + Vite + Tailwind CSS Client
│   ├── .env.example          # Environment variables template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Jubilee Navigation Header
│   │   │   ├── StatsCards.jsx       # Metrics Overview Cards
│   │   │   ├── ClaimsList.jsx       # Interactive Data Table & Filters
│   │   │   ├── CreateClaimModal.jsx # Claim Capture Form Modal
│   │   │   ├── ClaimDetailModal.jsx # Detail Drawer & Confirmation Dialog
│   │   │   ├── StatusBadge.jsx      # Color-Coded Status Pills
│   │   │   └── Toast.jsx            # Notification Banners
│   │   ├── App.jsx                  # Main State Container & API Service Calls
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore                # Excludes secrets & dependencies
└── README.md                 # Complete documentation
```

---

## 📥 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/starX-1/jubilee-interview.git
cd jubilee-interview
```

### 2. Environment Configuration

#### Backend Environment Setup
Copy the example environment file in `backend/` and provide your PostgreSQL / Neon DB connection string:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@<neon-hostname>/<database_name>?sslmode=require
```

#### Frontend Environment Setup
Copy the example environment file in `frontend/`:

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Install Dependencies

Install dependencies for both packages separately:

```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

---

## 🗄️ Database Setup & Migrations

The database uses **PostgreSQL** (Neon DB) with **UUID primary keys** (`gen_random_uuid()`).

### Schema Definition (`backend/src/config/schema.sql`)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    policy_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    claim_type VARCHAR(50) NOT NULL CHECK (claim_type IN ('Motor', 'Health', 'Travel', 'Property', 'Other')),
    claim_amount NUMERIC(12, 2) NOT NULL CHECK (claim_amount > 0),
    incident_date DATE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### Seeding Sample Claims
To initialize the database tables and populate sample claims (including sample claim `CLM-1001` for Jane Doe), run:

```bash
cd backend
npm run seed
```

---

## 🚀 How to Run Frontend & Backend

Run the backend server and frontend development server in two separate terminal windows:

### Terminal 1: Backend REST API
```bash
cd backend
npm start
```
- **API Base URL**: `http://localhost:5000/api/claims`
- **Health Check**: `http://localhost:5000/api/health`

### Terminal 2: Frontend Web Application
```bash
cd frontend
npm run dev
```
- **Web Portal**: `http://localhost:3000`

---

## 📡 Minimum API Specification

### 1. Create a Claim
- **Endpoint**: `POST /api/claims`
- **Request Body**:
  ```json
  {
    "policyNumber": "POL-2026-001",
    "customerName": "Jane Doe",
    "claimType": "Motor",
    "claimAmount": 12500,
    "incidentDate": "2026-08-15",
    "description": "Vehicle damage following a road accident"
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "success": true,
    "message": "Insurance claim created successfully.",
    "data": {
      "id": "ba15caa5-c857-47af-bafa-afe64da750f3",
      "claimNumber": "CLM-1001",
      "policyNumber": "POL-2026-001",
      "customerName": "Jane Doe",
      "claimType": "Motor",
      "claimAmount": 12500,
      "incidentDate": "2026-08-15",
      "description": "Vehicle damage following a road accident",
      "status": "SUBMITTED"
    }
  }
  ```

### 2. List Claims
- **Endpoint**: `GET /api/claims`
- **Query Parameters**:
  - `status`: Filter by status (`SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `PAID`)
  - `claimType`: Filter by category (`Motor`, `Health`, `Travel`, `Property`, `Other`)
  - `search`: Search query string matching claim number, policy number, or customer name.
- **Response** `(200 OK)`: Returns list array ordered by creation timestamp.

### 3. Get Claim Details
- **Endpoint**: `GET /api/claims/:id` (`:id` must be a valid UUID string)
- **Response** `(200 OK)`: Returns complete claim details.

### 4. Update Claim Status
- **Endpoint**: `PATCH /api/claims/:id/status`
- **Request Body**:
  ```json
  {
    "status": "APPROVED"
  }
  ```
- **Allowed Statuses**: `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `PAID`
- **Response** `(200 OK)`: Returns updated claim record.

---

## 💡 Key Assumptions Made

1. **Initial Status Handling**: All newly captured claims automatically receive the default status `'SUBMITTED'` upon creation in accordance with business requirements.
2. **UUID Primary Keys**: Claims use PostgreSQL random UUID primary keys (`gen_random_uuid()`) rather than integer IDs for security, preventing identifier guessing or enumeration.
3. **Claim Amount Validation**: Claim amounts are validated both client-side and server-side to ensure they are strictly positive numeric values (`claimAmount > 0`).
4. **Auto Claim Number Generation**: If a custom claim number is not explicitly supplied during creation, the system automatically generates an incrementing identifier formatted as `CLM-xxxx` based on recent DB records.
5. **Two-Step Status Update Confirmation**: To prevent accidental status mutations by claims officers, clicking a status transition button opens an interactive confirmation dialog requiring explicit confirmation before invoking the backend API.
