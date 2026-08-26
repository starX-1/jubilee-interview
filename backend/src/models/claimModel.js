const db = require('../config/db');

const ALLOWED_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'];
const ALLOWED_TYPES = ['Motor', 'Health', 'Travel', 'Property', 'Other'];

class ClaimModel {
  /**
   * Find last auto-increment claim number format (CLM-xxxx)
   */
  static async findLastClaimNumber() {
    const query = `
      SELECT claim_number 
      FROM claims 
      WHERE claim_number LIKE 'CLM-%' 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const result = await db.query(query);
    return result.rows.length > 0 ? result.rows[0].claim_number : null;
  }

  /**
   * Insert a new insurance claim record into PostgreSQL
   */
  static async create(data) {
    const query = `
      INSERT INTO claims (
        claim_number, 
        policy_number, 
        customer_name, 
        claim_type, 
        claim_amount, 
        incident_date, 
        description, 
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'SUBMITTED')
      RETURNING 
        id, 
        claim_number AS "claimNumber", 
        policy_number AS "policyNumber", 
        customer_name AS "customerName", 
        claim_type AS "claimType", 
        claim_amount::float AS "claimAmount", 
        incident_date AS "incidentDate", 
        description, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
    `;

    const values = [
      data.claimNumber,
      data.policyNumber,
      data.customerName,
      data.claimType,
      data.claimAmount,
      data.incidentDate,
      data.description
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all claims with optional status, claimType, or search term
   */
  static async findAll({ status, claimType, search } = {}) {
    let queryText = `
      SELECT 
        id, 
        claim_number AS "claimNumber", 
        policy_number AS "policyNumber", 
        customer_name AS "customerName", 
        claim_type AS "claimType", 
        claim_amount::float AS "claimAmount", 
        incident_date AS "incidentDate", 
        description, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM claims
      WHERE 1=1
    `;

    const params = [];

    if (status && ALLOWED_STATUSES.includes(status.toUpperCase())) {
      params.push(status.toUpperCase());
      queryText += ` AND status = $${params.length}`;
    }

    if (claimType && ALLOWED_TYPES.includes(claimType)) {
      params.push(claimType);
      queryText += ` AND claim_type = $${params.length}`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      queryText += ` AND (
        claim_number ILIKE $${params.length} OR 
        policy_number ILIKE $${params.length} OR 
        customer_name ILIKE $${params.length}
      )`;
    }

    queryText += ` ORDER BY created_at DESC`;

    const result = await db.query(queryText, params);
    return result.rows;
  }

  /**
   * Find single claim by UUID
   */
  static async findById(id) {
    const query = `
      SELECT 
        id, 
        claim_number AS "claimNumber", 
        policy_number AS "policyNumber", 
        customer_name AS "customerName", 
        claim_type AS "claimType", 
        claim_amount::float AS "claimAmount", 
        incident_date AS "incidentDate", 
        description, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM claims
      WHERE id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Update status of a claim
   */
  static async updateStatus(id, newStatus) {
    const query = `
      UPDATE claims
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING 
        id, 
        claim_number AS "claimNumber", 
        policy_number AS "policyNumber", 
        customer_name AS "customerName", 
        claim_type AS "claimType", 
        claim_amount::float AS "claimAmount", 
        incident_date AS "incidentDate", 
        description, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
    `;

    const result = await db.query(query, [newStatus, id]);
    return result.rows[0] || null;
  }
}

module.exports = ClaimModel;
