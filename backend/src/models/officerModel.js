const db = require('../config/db');

class OfficerModel {
  /**
   * Find officer by username (email)
   */
  static async findByUsername(username) {
    const query = `
      SELECT id, username, password_hash AS "passwordHash", full_name AS "fullName", role, created_at AS "createdAt"
      FROM officers
      WHERE username = $1
    `;
    const result = await db.query(query, [username]);
    return result.rows[0] || null;
  }

  /**
   * Find officer by UUID
   */
  static async findById(id) {
    const query = `
      SELECT id, username, full_name AS "fullName", role, created_at AS "createdAt"
      FROM officers
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = OfficerModel;
