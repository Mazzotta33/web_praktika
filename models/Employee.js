const db = require('../config/db');

class Employee {
  static async getAll(filters = {}) {
    let sql = `
      SELECT e.*, d.department_name, p.position_name
      FROM employees e
      JOIN departments d ON e.id_department = d.id_department
      JOIN positions   p ON e.id_position   = p.id_position
      WHERE 1=1
    `;
    const params = [];
    if (filters.name) {
      sql += ' AND e.full_name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.department) {
      sql += ' AND e.id_department = ?';
      params.push(filters.department);
    }
    if (filters.position) {
      sql += ' AND e.id_position = ?';
      params.push(filters.position);
    }
    sql += ' ORDER BY e.full_name';
    const [rows] = await db.execute(sql, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(`
      SELECT e.*, d.department_name, p.position_name
      FROM employees e
      JOIN departments d ON e.id_department = d.id_department
      JOIN positions   p ON e.id_position   = p.id_position
      WHERE e.id_employee = ?
    `, [id]);
    return rows[0];
  }

  static async create(data) {
    const number = await Employee._nextPersonnelNumber();
    const [result] = await db.execute(
      `INSERT INTO employees
        (personnel_number, full_name, photo, phone_work, phone_mobile, email, cabinet, id_department, id_position)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [number, data.full_name, data.photo || null,
       data.phone_work || null, data.phone_mobile || null,
       data.email || null, data.cabinet || null,
       data.id_department, data.id_position]
    );
    return result.insertId;
  }

  static async update(id, data) {
    await db.execute(
      `UPDATE employees SET
        full_name = ?, photo = ?, phone_work = ?, phone_mobile = ?,
        email = ?, cabinet = ?, id_department = ?, id_position = ?
       WHERE id_employee = ?`,
      [data.full_name, data.photo || null,
       data.phone_work || null, data.phone_mobile || null,
       data.email || null, data.cabinet || null,
       data.id_department, data.id_position, id]
    );
  }

  static async updateProfile(id, data) {
    await db.execute(
      'UPDATE employees SET photo = ?, phone_work = ?, phone_mobile = ?, email = ?, cabinet = ? WHERE id_employee = ?',
      [data.photo || null, data.phone_work || null, data.phone_mobile || null, data.email || null, data.cabinet || null, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM employees WHERE id_employee = ?', [id]);
  }

  static async _nextPersonnelNumber() {
    const [rows] = await db.execute(
      'SELECT MAX(CAST(SUBSTRING(personnel_number, 5) AS UNSIGNED)) AS max_num FROM employees WHERE personnel_number LIKE "EMP-%"'
    );
    const maxNum = rows[0].max_num || 0;
    return `EMP-${String(maxNum + 1).padStart(3, '0')}`;
  }
}

module.exports = Employee;
