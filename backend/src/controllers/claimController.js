const ClaimService = require('../services/claimService');

class ClaimController {
  /**
   * POST /api/claims - Create a new claim
   */
  static async createClaim(req, res, next) {
    try {
      const claim = await ClaimService.createClaim(req.body);
      return res.status(201).json({
        success: true,
        message: 'Insurance claim created successfully.',
        data: claim
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/claims - List claims with optional pagination & filtering
   */
  static async getClaims(req, res, next) {
    try {
      const { page, limit, status, claimType, search } = req.query;
      const result = await ClaimService.getClaims({ page, limit, status, claimType, search });
      return res.status(200).json({
        success: true,
        count: result.claims.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        data: result.claims
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/claims/:id - Get single claim details
   */
  static async getClaimById(req, res, next) {
    try {
      const { id } = req.params;
      const claim = await ClaimService.getClaimById(id);
      return res.status(200).json({
        success: true,
        data: claim
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/claims/:id/status - Update claim status
   */
  static async updateClaimStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedClaim = await ClaimService.updateClaimStatus(id, status);
      return res.status(200).json({
        success: true,
        message: `Claim status successfully updated to ${status}.`,
        data: updatedClaim
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClaimController;
