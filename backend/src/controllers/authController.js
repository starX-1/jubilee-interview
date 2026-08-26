const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OfficerModel = require('../models/officerModel');
const { JWT_SECRET } = require('../config/env');

class AuthController {
  /**
   * POST /api/auth/login - Officer Login
   */
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required.'
        });
      }

      const officer = await OfficerModel.findByUsername(username.trim());
      if (!officer) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. Officer username not found.'
        });
      }

      const isMatch = await bcrypt.compare(password, officer.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. Password incorrect.'
        });
      }

      const token = jwt.sign(
        {
          id: officer.id,
          username: officer.username,
          fullName: officer.fullName,
          role: officer.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        officer: {
          id: officer.id,
          username: officer.username,
          fullName: officer.fullName,
          role: officer.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me - Fetch authenticated officer profile
   */
  static async getMe(req, res, next) {
    try {
      const officer = await OfficerModel.findById(req.officer.id);
      if (!officer) {
        return res.status(404).json({
          success: false,
          error: 'Officer account not found.'
        });
      }
      return res.status(200).json({
        success: true,
        officer
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
