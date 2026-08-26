# Jubilee Insurance - Claims Tracker Application

A clean, production-ready Full Stack Insurance Claims Tracking web application developed for **Jubilee Insurance Kenya** customer service and claims officers.

![Jubilee Insurance Branding](https://jubileeinsurance.com/ke/wp-content/themes/jubilee/assets/favicon.png)

---

## 📋 Table of Contents
- [Prerequisites](#-prerequisites)
- [Project Architecture](#-project-architecture)
- [Installation & Setup](#-installation--setup)
- [Claims Officer Authentication Gate](#-claims-officer-authentication-gate)
- [Database Setup & Seeding](#-database-setup--seeding)
- [How to Run Frontend & Backend](#-how-to-run-frontend--backend)
- [Minimum API Specification & Pagination](#-minimum-api-specification--pagination)
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
│   │   ├── controllers/      # HTTP request/response handlers (Auth & Claims)
│   │   ├── models/           # PostgreSQL data queries (Claims & Officer)
│   │   ├── routes/           # Express routers (authRoutes, claimRoutes)
│   │   ├── middleware/       # JWT Auth, Zod Validation, & Error handling
│   │   ├── services/         # Business logic & auto claim number generator
│   │   ├── app.js            # Express app configuration & middleware
│   │   ├── server.js         # HTTP server entrypoint
│   │   └── seed.js           # Database seeding runner (Officer & Claims)
│   └── package.json
│
├── frontend/                 # React 18 + Vite + Tailwind CSS Client
│   ├── .env.example          # Environment variables template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Jubilee Navigation Header & Auth Profile
│   │   │   ├── StatsCards.jsx       # Metrics Overview Cards
│   │   │   ├── ClaimsList.jsx       # Interactive Data Table & Pagination Controls
│   │   │   ├── CreateClaimModal.jsx # Claim Capture Form Modal
│   │   │   ├── ClaimDetailModal.jsx # Detail Drawer & Status Confirmation Dialog
│   │   │   ├── LoginScreen.jsx      # Full-Page Protected Login Gateway
│   │   │   ├── StatusBadge.jsx      # Color-Coded Status Pills
│   │   │   └── Toast.jsx            # Notification Banners
│   │   ├── App.jsx                  # Main State Container & Authentication Gate
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
Copy `.env.example` in `backend/` to create your local `.env`:

```bash
cd backend
cp .env.example .env
```

Configure your `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@<neon-hostname>/<database_name>?sslmode=require
JWT_SECRET=your_secure_jwt_secret_key_2026
OFFICER_USERNAME=officer@jubilee.com
OFFICER_PASSWORD=Jubilee2026!
```

#### Frontend Environment Setup
Copy `.env.example` in `frontend/`:

```bash
cd ../frontend
cp .env.example .env
```

Configure `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Install Dependencies

```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

---

## 🔐 Claims Officer Authentication Gate

The application enforces a **Protected Authentication Gate**:

1. **Full-Page Login Redirection**:
   - Unauthenticated users cannot view the claims table, statistics, or incident details. Loading the application directs users straight to the **Claims Officer Login Screen**.
2. **Environment-Based Officer Credentials**:
   - `OFFICER_USERNAME` (e.g. `officer@jubilee.com`)
   - `OFFICER_PASSWORD` (e.g. `Jubilee2026!`)
3. **Seeding Officer User**:
   - Running `npm run seed` in `backend/` creates or updates the Officer account in the PostgreSQL `officers` table using **Bcrypt password hashing**.
4. **Authentication Session**:
   - Logging in issues a 24-hour JWT token stored in `localStorage`. Once authenticated, the full Claims Dashboard is revealed.
   - Officers can click **Log Out** in the header or welcome banner to return to the login screen.

---

## 🗄️ Database Setup & Seeding

The database uses **PostgreSQL** (Neon DB) with **UUID primary keys** (`gen_random_uuid()`).

### Seeding Officer Account & Sample Claims
To initialize tables (`officers` and `claims`) and seed sample data:

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
- **Auth Endpoint**: `http://localhost:5000/api/auth/login`
- **Health Check**: `http://localhost:5000/api/health`

### Terminal 2: Frontend Web Application
```bash
cd frontend
npm run dev
```
- **Web Portal**: `http://localhost:3000`

---

## 📡 Minimum API Specification & Pagination

### 1. Claims Officer Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "username": "officer@jubilee.com",
    "password": "Jubilee2026!"
  }
  ```
- **Response** `(200 OK)`: Returns JWT `token` and `officer` profile object.

---

### 2. List Claims (With Server-Side Pagination & Filtering)
- **Endpoint**: `GET /api/claims`
- **Query Parameters**:
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `5`, configurable up to `100`)
  - `status`: Filter by status (`SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `PAID`)
  - `claimType`: Filter by category (`Motor`, `Health`, `Travel`, `Property`, `Other`)
  - `search`: Search query string matching claim number, policy number, or customer name.
- **Example Request**: `GET /api/claims?page=1&limit=5&status=SUBMITTED`
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "count": 5,
    "total": 12,
    "page": 1,
    "limit": 5,
    "totalPages": 3,
    "data": [
      {
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
    ]
  }
  ```

---

### 3. Create a Claim
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
- **Response** `(201 Created)`: Returns newly created claim record with status `SUBMITTED`.

---

### 4. Get Claim Details
- **Endpoint**: `GET /api/claims/:id` (`:id` must be a valid UUID string)
- **Response** `(200 OK)`: Returns complete claim details.

---

### 5. Update Claim Status
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

1. **Protected Entry Gate**: The application blocks unauthenticated access to claims records. Upon initial load, users are directed to the login page (`LoginScreen.jsx`) and must log in as a Claims Officer before viewing the dashboard.
2. **Seeded Officer Credentials**: Claims Officers are initialized from `OFFICER_USERNAME` and `OFFICER_PASSWORD` environment variables in `backend/.env`. Running `npm run seed` populates or updates this user in PostgreSQL using Bcrypt hashing.
3. **Server-Side Pagination**: Claims querying supports `page` and `limit` pagination parameters, returning total count metadata so the frontend can render responsive pagination controls (*Prev/Next*, *Page X of Y*, *Limit selector*).
4. **Initial Status Handling**: All newly captured claims automatically receive the default status `'SUBMITTED'` upon creation in accordance with business requirements.
5. **UUID Primary Keys**: Claims and Officers use PostgreSQL random UUID primary keys (`gen_random_uuid()`) rather than integer IDs for security.
6. **Claim Amount Validation**: Claim amounts are validated both client-side and server-side to ensure they are strictly positive numeric values (`claimAmount > 0`).
7. **Two-Step Status Update Confirmation**: Clicking a status transition button opens an interactive confirmation dialog requiring explicit confirmation before invoking the backend API.
