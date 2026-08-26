const express = require('express');
const router = express.Router();
const { z } = require('zod');
const db = require('../db');

// Allowed status values
const ALLOWED_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'];
const ALLOWED_TYPES = ['Motor', 'Health', 'Travel', 'Property', 'Other'];

// Validation schema for creating a claim
const createClaimSchema = z.object({
  claimNumber: z.string().optional(),
  policyNumber: z.string().min(1, 'Policy number is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  claimType: z.enum(['Motor', 'Health', 'Travel', 'Property', 'Other'], {
    errorMap: () => ({ message: 'Claim type must be one of: Motor, Health, Travel, Property, Other' })
  }),
  claimAmount: z.number({
    invalid_type_error: 'Claim amount must be a valid number'
  }).positive('Claim amount must be a positive number (> 0)'),
  incidentDate: z.string().min(1, 'Incident date is required'),
  description: z.string().min(1, 'Description is required')
});

// Validation schema for updating claim status
const updateStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'], {
    errorMap: () => ({ message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}` })
  })
});

/**
 * Generate auto-incrementing claim number format CLM-100X
 */
async function generateClaimNumber() {
  const result = await db.query(
    `SELECT claim_number FROM claims WHERE claim_number LIKE 'CLM-%' ORDER BY created_at DESC LIMIT 1`
  );
  if (result.rows.length > 0) {
    const lastNumStr = result.rows[0].claim_number.replace('CLM-', '');
    const lastNum = parseInt(lastNumStr, 10);
    if (!isNaN(lastNum)) {
      return `CLM-${lastNum + 1}`;
    }
  }
  return `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * POST /api/claims - Create a new claim
 */
router.post('/', async (req, res) => {
  try {
    // Parse claimAmount to number if passed as string
    if (typeof req.body.claimAmount === 'string') {
      req.body.claimAmount = parseFloat(req.body.claimAmount);
    }

    const validation = createClaimSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errorMessages.join(', '),
        details: errorMessages
      });
    }

    const data = validation.data;
    const claimNumber = data.claimNumber && data.claimNumber.trim() !== ''
      ? data.claimNumber.trim()
      : await generateClaimNumber();

    const insertQuery = `
      INSERT INTO claims (claim_number, policy_number, customer_name, claim_type, claim_amount, incident_date, description, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'SUBMITTED')
      RETURNING id, claim_number AS "claimNumber", policy_number AS "policyNumber", 
                customer_name AS "customerName", claim_type AS "claimType", 
                claim_amount::float AS "claimAmount", incident_date AS "incidentDate", 
                description, status, created_at AS "createdAt", updated_at AS "updatedAt"
    `;

    const result = await db.query(insertQuery, [
      claimNumber,
      data.policyNumber,
      data.customerName,
      data.claimType,
      data.claimAmount,
      data.incidentDate,
      data.description
    ]);

    return res.status(201).json({
      success: true,
      message: 'Insurance claim created successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating claim:', error);
    if (error.code === '23505') { // Unique constraint violation in Postgres
      return res.status(400).json({
        success: false,
        error: 'A claim with this claim number already exists.'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while creating the claim.'
    });
  }
});

/**
 * GET /api/claims - List claims with optional filtering & searching
 */
router.get('/', async (req, res) => {
  try {
    const { status, claimType, search } = req.query;
    let queryText = `
      SELECT id, claim_number AS "claimNumber", policy_number AS "policyNumber", 
             customer_name AS "customerName", claim_type AS "claimType", 
             claim_amount::float AS "claimAmount", incident_date AS "incidentDate", 
             description, status, created_at AS "createdAt", updated_at AS "updatedAt"
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
      queryText += ` AND (claim_number ILIKE $${params.length} OR policy_number ILIKE $${params.length} OR customer_name ILIKE $${params.length})`;
    }

    queryText += ` ORDER BY created_at DESC`;

    const result = await db.query(queryText, params);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve claims list.'
    });
  }
});

/**
 * GET /api/claims/:id - Get single claim details by UUID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const selectQuery = `
      SELECT id, claim_number AS "claimNumber", policy_number AS "policyNumber", 
             customer_name AS "customerName", claim_type AS "claimType", 
             claim_amount::float AS "claimAmount", incident_date AS "incidentDate", 
             description, status, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM claims
      WHERE id = $1
    `;

    const result = await db.query(selectQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Claim with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching claim details:', error);
    // Invalid UUID format error in postgres (22P02)
    if (error.code === '22P02') {
      return res.status(400).json({
        success: false,
        error: 'Invalid UUID format provided for claim ID.'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve claim details.'
    });
  }
});

/**
 * PATCH /api/claims/:id/status - Update claim status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const validation = updateStatusSchema.safeParse(req.body);

    if (!validation.success) {
      const errorMessages = validation.error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errorMessages.join(', ')
      });
    }

    const { status } = validation.data;

    const updateQuery = `
      UPDATE claims
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, claim_number AS "claimNumber", policy_number AS "policyNumber", 
                customer_name AS "customerName", claim_type AS "claimType", 
                claim_amount::float AS "claimAmount", incident_date AS "incidentDate", 
                description, status, created_at AS "createdAt", updated_at AS "updatedAt"
    `;

    const result = await db.query(updateQuery, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Claim with ID '${id}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Claim status successfully updated to ${status}.`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    if (error.code === '22P02') {
      return res.status(400).json({
        success: false,
        error: 'Invalid UUID format provided for claim ID.'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to update claim status.'
    });
  }
});

module.exports = router;
