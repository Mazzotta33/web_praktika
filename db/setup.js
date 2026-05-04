const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function setup() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true,
    charset: 'utf8mb4'
  });

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await conn.query(schema);
  console.log('Схема создана');

  await conn.query(`USE spravochnik`);

  const [roles] = await conn.query('SELECT COUNT(*) AS cnt FROM roles');
  if (roles[0].cnt === 0) {
    await conn.query(`INSERT INTO roles (role_name) VALUES ('Администратор'), ('Модератор'), ('Сотрудник')`);
    console.log('Роли добавлены');
  }

  const [depts] = await conn.query('SELECT COUNT(*) AS cnt FROM departments');
  if (depts[0].cnt === 0) {
    await conn.query(`INSERT INTO departments (department_name) VALUES
      ('Отдел кадров'), ('IT-отдел'), ('Бухгалтерия'), ('Маркетинг'), ('Производство')`);
    console.log('Отделы добавлены');
  }

  const [pos] = await conn.query('SELECT COUNT(*) AS cnt FROM positions');
  if (pos[0].cnt === 0) {
    await conn.query(`INSERT INTO positions (position_name) VALUES
      ('Директор'), ('Менеджер'), ('Инженер'), ('Специалист'), ('Бухгалтер'), ('Аналитик')`);
    console.log('Должности добавлены');
  }

  const [emps] = await conn.query('SELECT COUNT(*) AS cnt FROM employees');
  if (emps[0].cnt === 0) {
    await conn.query(`INSERT INTO employees (personnel_number, full_name, phone_work, phone_mobile, email, cabinet, id_department, id_position) VALUES
      ('EMP-001', 'Иванов Иван Иванович',       '8-800-100-01-01', '8-900-111-11-11', 'ivanov@company.ru',   '101', 1, 1),
      ('EMP-002', 'Петрова Мария Сергеевна',     '8-800-100-01-02', '8-900-222-22-22', 'petrova@company.ru',  '205', 1, 2),
      ('EMP-003', 'Сидоров Алексей Владимирович','8-800-100-01-03', '8-900-333-33-33', 'sidorov@company.ru',  '301', 2, 3),
      ('EMP-004', 'Козлова Анна Петровна',       '8-800-100-01-04', '8-900-444-44-44', 'kozlova@company.ru',  '302', 3, 5),
      ('EMP-005', 'Новиков Дмитрий Олегович',    '8-800-100-01-05', '8-900-555-55-55', 'novikov@company.ru',  '401', 4, 6)`);
    console.log('Сотрудники добавлены');
  }

  const [accs] = await conn.query('SELECT COUNT(*) AS cnt FROM accounts');
  if (accs[0].cnt === 0) {
    const adminHash = await bcrypt.hash('admin123', 10);
    const modHash   = await bcrypt.hash('mod123',   10);
    const empHash   = await bcrypt.hash('emp123',   10);

    await conn.query(`INSERT INTO accounts (login, password_hash, id_employee, id_role, is_active) VALUES
      ('admin',  ?, 1, 1, 1),
      ('petrov', ?, 2, 2, 1),
      ('sidorov',?, 3, 3, 1)`,
      [adminHash, modHash, empHash]);
    console.log('Учётные записи добавлены');
    console.log('  admin  / admin123 — Администратор');
    console.log('  petrov / mod123   — Модератор');
    console.log('  sidorov/ emp123   — Сотрудник');
  }

  await conn.end();
  console.log('\nНастройка завершена. Запуск: npm start');
}

setup().catch(err => { console.error(err); process.exit(1); });
