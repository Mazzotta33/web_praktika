CREATE DATABASE IF NOT EXISTS spravochnik CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE spravochnik;

CREATE TABLE IF NOT EXISTS roles (
  id_role   INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
  id_department   INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL,
  manager_id      INT NULL
);

CREATE TABLE IF NOT EXISTS positions (
  id_position   INT AUTO_INCREMENT PRIMARY KEY,
  position_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id_employee      INT AUTO_INCREMENT PRIMARY KEY,
  personnel_number VARCHAR(20) NOT NULL UNIQUE,
  full_name        VARCHAR(200) NOT NULL,
  photo            VARCHAR(255) DEFAULT NULL,
  phone_work       VARCHAR(20) DEFAULT NULL,
  phone_mobile     VARCHAR(20) DEFAULT NULL,
  email            VARCHAR(100) DEFAULT NULL,
  cabinet          VARCHAR(20) DEFAULT NULL,
  id_department    INT NOT NULL,
  id_position      INT NOT NULL,
  FOREIGN KEY (id_department) REFERENCES departments(id_department) ON DELETE RESTRICT,
  FOREIGN KEY (id_position)   REFERENCES positions(id_position)    ON DELETE RESTRICT
);

ALTER TABLE departments
  ADD CONSTRAINT fk_dept_manager
  FOREIGN KEY (manager_id) REFERENCES employees(id_employee) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS accounts (
  id_account    INT AUTO_INCREMENT PRIMARY KEY,
  login         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  id_employee   INT NOT NULL,
  id_role       INT NOT NULL,
  is_active     TINYINT(1) DEFAULT 1,
  FOREIGN KEY (id_employee) REFERENCES employees(id_employee) ON DELETE CASCADE,
  FOREIGN KEY (id_role)     REFERENCES roles(id_role)         ON DELETE RESTRICT
);
