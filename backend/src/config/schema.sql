-- Jubilee Insurance Claims Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Officers Table for Authentication
CREATE TABLE IF NOT EXISTS officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CLAIMS_OFFICER',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Claims Table
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

-- Indexes for optimized querying
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_claim_number ON claims(claim_number);
CREATE INDEX IF NOT EXISTS idx_claims_customer_name ON claims(customer_name);
CREATE INDEX IF NOT EXISTS idx_officers_username ON officers(username);
