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
   * Find all claims with pagination (page, limit) and optional status, claimType, or search term
   */
  static async findAll({ page = 1, limit = 5, status, claimType, search } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 5));
    const offset = (pageNum - 1) * limitNum;

    let whereClause = ` WHERE 1=1`;
    const params = [];

    if (status && ALLOWED_STATUSES.includes(status.toUpperCase())) {
      params.push(status.toUpperCase());
      whereClause += ` AND status = $${params.length}`;
    }

    if (claimType && ALLOWED_TYPES.includes(claimType)) {
      params.push(claimType);
      whereClause += ` AND claim_type = $${params.length}`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      whereClause += ` AND (
        claim_number ILIKE $${params.length} OR 
        policy_number ILIKE $${params.length} OR 
        customer_name ILIKE $${params.length}
      )`;
    }

    // 1. Get total count
    const countQuery = `SELECT COUNT(*) AS total FROM claims${whereClause}`;
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // 2. Fetch paginated rows
    const dataParams = [...params, limitNum, offset];
    const dataQuery = `
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
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
    `;

    const dataResult = await db.query(dataQuery, dataParams);

    return {
      claims: dataResult.rows,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    };
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
