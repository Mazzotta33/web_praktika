const db = require('../config/db');

class Position {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM positions ORDER BY position_name');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM positions WHERE id_position = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const [result] = await db.execute('INSERT INTO positions (position_name) VALUES (?)', [data.position_name]);
    return result.insertId;
  }

  static async update(id, data) {
    await db.execute('UPDATE positions SET position_name = ? WHERE id_position = ?', [data.position_name, id]);
  }

  static async delete(id) {
    await db.execute('DELETE FROM positions WHERE id_position = ?', [id]);
  }
}

module.exports = Position;
