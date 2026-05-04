const db = require('../config/db');

class Role {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM roles ORDER BY id_role');
    return rows;
  }
}

module.exports = Role;
