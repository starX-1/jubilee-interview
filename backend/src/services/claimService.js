const ClaimModel = require('../models/claimModel');

class ClaimService {
  /**
   * Helper to generate unique incrementing claim number (e.g. CLM-1006)
   */
  static async generateClaimNumber() {
    const lastClaimNumber = await ClaimModel.findLastClaimNumber();
    if (lastClaimNumber) {
      const lastNumStr = lastClaimNumber.replace('CLM-', '');
      const lastNum = parseInt(lastNumStr, 10);
      if (!isNaN(lastNum)) {
        return `CLM-${lastNum + 1}`;
      }
    }
    return `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  /**
   * Create a new claim
   */
  static async createClaim(claimData) {
    const claimNumber = claimData.claimNumber && claimData.claimNumber.trim() !== ''
      ? claimData.claimNumber.trim()
      : await this.generateClaimNumber();

    const newClaim = await ClaimModel.create({
      ...claimData,
      claimNumber
    });

    return newClaim;
  }

  /**
   * Get all claims with pagination & filters
   */
  static async getClaims(filters) {
    return await ClaimModel.findAll(filters);
  }

  /**
   * Get claim details by UUID
   */
  static async getClaimById(id) {
    const claim = await ClaimModel.findById(id);
    if (!claim) {
      const error = new Error(`Claim with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }
    return claim;
  }

  /**
   * Update claim status
   */
  static async updateClaimStatus(id, status) {
    const updatedClaim = await ClaimModel.updateStatus(id, status);
    if (!updatedClaim) {
      const error = new Error(`Claim with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }
    return updatedClaim;
  }
}

module.exports = ClaimService;
