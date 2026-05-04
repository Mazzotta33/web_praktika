const Account  = require('../models/Account');
const Employee = require('../models/Employee');
const Role     = require('../models/Role');

exports.index = async (req, res, next) => {
  try {
    const accounts = await Account.getAll();
    res.render('accounts/index', { title: 'Учётные записи', accounts });
  } catch (err) { next(err); }
};

exports.createForm = async (req, res, next) => {
  try {
    const [employees, roles] = await Promise.all([Employee.getAll(), Role.getAll()]);
    res.render('accounts/form', { title: 'Новая учётная запись', employees, roles });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.body.login || !req.body.id_employee || !req.body.id_role) {
      req.flash('error', 'Заполните все поля');
      return res.redirect('/accounts/new');
    }
    const { tempPassword } = await Account.create(req.body);
    req.flash('success', `Учётная запись создана. Временный пароль: ${tempPassword}`);
    res.redirect('/accounts');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      req.flash('error', 'Данный логин уже используется');
      return res.redirect('/accounts/new');
    }
    next(err);
  }
};

exports.deactivate = async (req, res, next) => {
  try {
    await Account.deactivate(req.params.id);
    req.flash('success', 'Учётная запись деактивирована');
    res.redirect('/accounts');
  } catch (err) { next(err); }
};

exports.activate = async (req, res, next) => {
  try {
    await Account.activate(req.params.id);
    req.flash('success', 'Учётная запись активирована');
    res.redirect('/accounts');
  } catch (err) { next(err); }
};

exports.changeRole = async (req, res, next) => {
  try {
    if (!req.body.id_role) {
      req.flash('error', 'Выберите роль');
      return res.redirect('/accounts');
    }
    await Account.changeRole(req.params.id, req.body.id_role);
    req.flash('success', 'Роль изменена');
    res.redirect('/accounts');
  } catch (err) { next(err); }
};
