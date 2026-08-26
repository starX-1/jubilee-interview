# Jubilee Insurance - Claims Tracker

A clean, production-ready Full Stack Insurance Claims Tracking web application built for **Jubilee Insurance Kenya** claims officers.

---

## 🌟 Overview & Architecture

The workspace is structured into two clean, self-contained folders (`backend/` and `frontend/`), with environment configurations scoped locally to each project:

```
Jubilee interview/
├── backend/                  # Node.js & Express REST API
│   ├── .env                  # Backend environment variables (PORT, DATABASE_URL)
│   ├── db/
│   │   ├── index.js          # PostgreSQL connection pool (Neon DB)
│   │   ├── schema.sql        # Database schema definition (UUID primary keys)
│   │   └── seed.js           # Sample claims seeding script
│   ├── routes/
│   │   └── claims.js         # REST API endpoints (POST, GET, PATCH)
│   ├── index.js              # Express server entrypoint
│   └── package.json
│
├── frontend/                 # React 18 + Vite + Tailwind CSS UI
│   ├── .env                  # Frontend environment variables (VITE_API_BASE_URL)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Jubilee Insurance Navbar Header
│   │   │   ├── StatsCards.jsx       # Overview Metrics Cards
│   │   │   ├── ClaimsList.jsx       # Data Table, Filters & Search
│   │   │   ├── CreateClaimModal.jsx # Claim Capture Form & Validation
│   │   │   ├── ClaimDetailModal.jsx # Details Drawer & Status Controller
│   │   │   ├── StatusBadge.jsx      # Status Pill Badges
│   │   │   └── Toast.jsx            # Feedback Notifications
│   │   ├── App.jsx                  # Main State Container
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md                 # System Documentation
```

---

## 🚀 How to Run Backend and Frontend Separately

### 1. Backend Server (`backend/`)

Open a terminal and navigate to `backend/`:

```bash
cd backend
```

Ensure `backend/.env` exists with your settings:
```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_x46FTbEKMHSo@ep-round-violet-ay7wab6e-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Seed Sample Data (Optional / First Run):**
```bash
npm run seed
```

**Start Backend API Server:**
```bash
npm start
```
- **API URL**: [http://localhost:5000/api/claims](http://localhost:5000/api/claims)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### 2. Frontend Application (`frontend/`)

Open a second terminal window and navigate to `frontend/`:

```bash
cd frontend
```

Ensure `frontend/.env` exists:
```env
VITE_API_BASE_URL=http://localhost:5000
```

**Start Frontend Development Server:**
```bash
npm run dev
```
- **Web App**: [http://localhost:3000](http://localhost:3000)

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
- **Response** `(201 Created)`: Newly created claim object with UUID primary key and default status `SUBMITTED`.

### 2. List Claims
- **Endpoint**: `GET /api/claims`
- **Query Parameters**: `status`, `claimType`, `search`
- **Response** `(200 OK)`: Returns array of claims ordered by creation date.

### 3. Get Claim Details
- **Endpoint**: `GET /api/claims/:id` (where `:id` is UUID string)
- **Response** `(200 OK)`: Returns single claim object.

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

## 🗄️ Database & Sample Data

- **Database**: Neon PostgreSQL cloud database connected via connection pool (`pg`).
- **Primary Keys**: PostgreSQL random UUIDs (`gen_random_uuid()`).
- **Sample Record**:
  - `Claim Number`: CLM-1001
  - `Policy Number`: POL-2026-001
  - `Customer Name`: Jane Doe
  - `Claim Type`: Motor
  - `Claim Amount`: 12,500.00 KES
  - `Incident Date`: 2026-08-15
  - `Description`: Vehicle damage following a road accident
  - `Status`: SUBMITTED
