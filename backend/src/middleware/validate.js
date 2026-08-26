/**
 * Express middleware builder for Zod schema validation
 */
const validateBody = (schema) => (req, res, next) => {
  // Parse claimAmount to float if passed as string
  if (req.body && typeof req.body.claimAmount === 'string') {
    req.body.claimAmount = parseFloat(req.body.claimAmount);
  }

  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message);
    return res.status(400).json({
      success: false,
      error: errorMessages.join(', '),
      details: errorMessages
    });
  }

  req.body = result.data;
  next();
};

module.exports = {
  validateBody
};
