const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Account {
  static async getAll() {
    const [rows] = await db.execute(`
      SELECT a.*, r.role_name, e.full_name
      FROM accounts a
      JOIN roles     r ON a.id_role     = r.id_role
      JOIN employees e ON a.id_employee = e.id_employee
      ORDER BY a.login
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(`
      SELECT a.*, r.role_name, e.full_name
      FROM accounts a
      JOIN roles     r ON a.id_role     = r.id_role
      JOIN employees e ON a.id_employee = e.id_employee
      WHERE a.id_account = ?
    `, [id]);
    return rows[0];
  }

  static async findByLogin(login) {
    const [rows] = await db.execute(`
      SELECT a.*, r.role_name, e.full_name, e.id_employee
      FROM accounts a
      JOIN roles     r ON a.id_role     = r.id_role
      JOIN employees e ON a.id_employee = e.id_employee
      WHERE a.login = ?
    `, [login]);
    return rows[0];
  }

  static async create(data) {
    const tempPassword = Account._generateTempPassword();
    const hash = await bcrypt.hash(tempPassword, 10);
    const [result] = await db.execute(
      'INSERT INTO accounts (login, password_hash, id_employee, id_role, is_active) VALUES (?,?,?,?,1)',
      [data.login, hash, data.id_employee, data.id_role]
    );
    return { id: result.insertId, tempPassword };
  }

  static async deactivate(id) {
    await db.execute('UPDATE accounts SET is_active = 0 WHERE id_account = ?', [id]);
  }

  static async activate(id) {
    await db.execute('UPDATE accounts SET is_active = 1 WHERE id_account = ?', [id]);
  }

  static async changeRole(id, roleId) {
    await db.execute('UPDATE accounts SET id_role = ? WHERE id_account = ?', [roleId, id]);
  }

  static async verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }

  static _generateTempPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let pass = '';
    for (let i = 0; i < 8; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    return pass;
  }
}

module.exports = Account;
