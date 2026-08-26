const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { validateBody } = require('../middleware/validate');
const ClaimController = require('../controllers/claimController');

// Allowed enums
const ALLOWED_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'];

// Zod schema for creating a claim
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

// Zod schema for updating status
const updateStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'], {
    errorMap: () => ({ message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}` })
  })
});

/**
 * Routes definitions
 */
router.post('/', validateBody(createClaimSchema), ClaimController.createClaim);
router.get('/', ClaimController.getClaims);
router.get('/:id', ClaimController.getClaimById);
router.patch('/:id/status', validateBody(updateStatusSchema), ClaimController.updateClaimStatus);

module.exports = router;
