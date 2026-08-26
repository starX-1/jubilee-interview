# Jubilee Insurance - Claims Tracker

A clean, production-ready Full Stack Insurance Claims Tracking web application built for **Jubilee Insurance Kenya** customer service and claims officers.

![Jubilee Insurance Branding](https://jubileeinsurance.com/ke/wp-content/themes/jubilee/assets/favicon.png)

---

## 🌟 Overview & Features

This practical exercise solution fulfills all functional and technical requirements specified for the Junior Full Stack Engineer interview:

- **Capture Claims**: Create new claims with `claimNumber`, `policyNumber`, `customerName`, `claimType` (*Motor, Health, Travel, Property, Other*), `claimAmount` (positive number validation), `incidentDate`, and `description`. Newly created claims automatically start with status `SUBMITTED`.
- **View Submitted Claims**: Interactive data table listing all claims with search (by claim #, policy #, customer), type filters, and status tab filtering (*ALL, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, PAID*).
- **Claim Detail Drawer/Modal**: Inspect complete claim information including database UUID primary key, incident timeline, customer details, and policy reference.
- **Update Claim Status**: Claims officers can update claim statuses directly to `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, or `PAID` with real-time UI updates and feedback toasts.
- **Jubilee Insurance Color Scheme**: Interface styled strictly to match Jubilee Insurance Kenya brand guidelines (Vibrant Jubilee Red `#E30613`, Slate Navy `#0F172A`, Pearl Gray cards `#F8FAFC`, Gold accents).

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Backend** | Node.js & Express.js | REST API with Zod schema validation & CORS |
| **Frontend** | React 18 & Vite | Responsive UI, Lucide icons, Toast alerts |
| **Styling** | Tailwind CSS | Customized with Jubilee Insurance brand colors |
| **Database** | PostgreSQL (Neon DB) | Cloud PG pool connection with SSL & UUID keys |
| **Source Control** | Git / GitHub | Clean commit history & structured repository |

---

## 📁 Repository Structure

```
Jubilee interview/
├── backend/                  # Express REST API Server
│   ├── db/
│   │   ├── index.js          # PostgreSQL pg pool connection
│   │   ├── schema.sql        # Database schema definition (UUID PKs)
│   │   └── seed.js           # Sample data seeding script
│   ├── routes/
│   │   └── claims.js         # API Route Handlers (POST, GET, PATCH)
│   ├── index.js              # Express app entrypoint & server start
│   └── package.json
│
├── frontend/                 # React + Tailwind CSS Web Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Jubilee Navigation Header
│   │   │   ├── StatsCards.jsx       # Overview Metrics Cards
│   │   │   ├── ClaimsList.jsx       # Claims Data Table & Filters
│   │   │   ├── CreateClaimModal.jsx # Claim Capture Form & Validation
│   │   │   ├── ClaimDetailModal.jsx # Details Drawer & Status Controller
│   │   │   ├── StatusBadge.jsx      # Status Pills
│   │   │   └── Toast.jsx            # Notification Toast
│   │   ├── App.jsx                  # Main State & API Bindings
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .env                      # Environment Variables (DATABASE_URL, PORT)
├── package.json              # Root package orchestrator
├── README.md                 # Complete documentation
└── walkthrough.md            # Technical walkthrough & verification
```

---

## ⚙️ Minimum API Specification

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
      "id": "96df8ffe-b662-49f1-b833-f8728c1266cd",
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
- **Query Parameters**: `status`, `claimType`, `search`
- **Response** `(200 OK)`: Returns array of claims ordered by creation timestamp.

### 3. Get Claim Details
- **Endpoint**: `GET /api/claims/:id` (where `:id` is UUID string)
- **Response** `(200 OK)`: Returns complete single claim object.

### 4. Update Claim Status
- **Endpoint**: `PATCH /api/claims/:id/status`
- **Request Body**:
  ```json
  {
    "status": "APPROVED"
  }
  ```
- **Allowed Statuses**: `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `PAID`
- **Response** `(200 OK)`: Returns updated claim object.

---

## 🗄️ Database Schema & Sample Data

### Schema SQL (`backend/db/schema.sql`)
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

### Sample Data Included
- **Claim Number**: `CLM-1001`
- **Policy Number**: `POL-2026-001`
- **Customer Name**: `Jane Doe`
- **Claim Type**: `Motor`
- **Claim Amount**: `12,500.00 KES`
- **Incident Date**: `2026-08-15`
- **Description**: `Vehicle damage following a road accident`
- **Status**: `SUBMITTED`

*(Additional seed data included for Health, Travel, Property, and Other types).*

---

## 🚀 How to Run the Application Locally

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Environment Configuration
The root `.env` file contains the Neon PostgreSQL connection string:
```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_x46FTbEKMHSo@ep-round-violet-ay7wab6e-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. Install Dependencies
```bash
npm run install:all
```

### 4. Seed Database
Populate the Neon DB database with sample records:
```bash
npm run seed
```

### 5. Start Application (Dev Server)
Run both backend Express server and React Vite frontend concurrently:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api/claims`
- **API Health**: `http://localhost:5000/api/health`
