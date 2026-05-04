const db = require('../config/db');

class Department {
  static async getAll() {
    const [rows] = await db.execute(`
      SELECT d.*, e.full_name AS manager_name
      FROM departments d
      LEFT JOIN employees e ON d.manager_id = e.id_employee
      ORDER BY d.department_name
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM departments WHERE id_department = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const [result] = await db.execute(
      'INSERT INTO departments (department_name, manager_id) VALUES (?, ?)',
      [data.department_name, data.manager_id || null]
    );
    return result.insertId;
  }

  static async update(id, data) {
    await db.execute(
      'UPDATE departments SET department_name = ?, manager_id = ? WHERE id_department = ?',
      [data.department_name, data.manager_id || null, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM departments WHERE id_department = ?', [id]);
  }
}

module.exports = Department;
