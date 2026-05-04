const Employee   = require('../models/Employee');
const Department = require('../models/Department');
const Position   = require('../models/Position');

exports.index = async (req, res, next) => {
  try {
    const filters = {
      name:       req.query.name       || '',
      department: req.query.department || '',
      position:   req.query.position   || ''
    };
    const [employees, departments, positions] = await Promise.all([
      Employee.getAll(filters),
      Department.getAll(),
      Position.getAll()
    ]);
    res.render('employees/index', { title: 'Справочник сотрудников', employees, departments, positions, filters });
  } catch (err) { next(err); }
};

exports.show = async (req, res, next) => {
  try {
    const emp = await Employee.getById(req.params.id);
    if (!emp) { req.flash('error', 'Сотрудник не найден'); return res.redirect('/employees'); }
    res.render('employees/show', { title: emp.full_name, emp });
  } catch (err) { next(err); }
};

exports.createForm = async (req, res, next) => {
  try {
    const [departments, positions] = await Promise.all([Department.getAll(), Position.getAll()]);
    res.render('employees/form', { title: 'Новый сотрудник', emp: {}, departments, positions, action: '/employees' });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.body.full_name || !req.body.id_department || !req.body.id_position) {
      req.flash('error', 'Заполните обязательные поля');
      return res.redirect('/employees/new');
    }
    const data = { ...req.body };
    if (req.file) data.photo = '/uploads/' + req.file.filename;
    await Employee.create(data);
    req.flash('success', 'Сотрудник добавлен');
    res.redirect('/employees');
  } catch (err) { next(err); }
};

exports.editForm = async (req, res, next) => {
  try {
    const [emp, departments, positions] = await Promise.all([
      Employee.getById(req.params.id),
      Department.getAll(),
      Position.getAll()
    ]);
    if (!emp) { req.flash('error', 'Сотрудник не найден'); return res.redirect('/employees'); }
    res.render('employees/form', {
      title:   'Редактировать: ' + emp.full_name,
      emp, departments, positions,
      action:  '/employees/' + emp.id_employee + '/update'
    });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const emp = await Employee.getById(req.params.id);
    if (!emp) { req.flash('error', 'Сотрудник не найден'); return res.redirect('/employees'); }
    const data = { ...req.body };
    if (req.file) data.photo = '/uploads/' + req.file.filename;
    else data.photo = emp.photo;
    await Employee.update(req.params.id, data);
    req.flash('success', 'Данные обновлены');
    res.redirect('/employees/' + req.params.id);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await Employee.delete(req.params.id);
    req.flash('success', 'Сотрудник удалён');
    res.redirect('/employees');
  } catch (err) { next(err); }
};

exports.profileForm = async (req, res, next) => {
  try {
    const emp = await Employee.getById(req.session.user.id_employee);
    if (!emp) { req.flash('error', 'Профиль не найден'); return res.redirect('/employees'); }
    res.render('employees/profile', { title: 'Мой профиль', emp });
  } catch (err) { next(err); }
};

exports.profileUpdate = async (req, res, next) => {
  try {
    const emp = await Employee.getById(req.session.user.id_employee);
    if (!emp) { req.flash('error', 'Профиль не найден'); return res.redirect('/employees'); }
    const data = { ...req.body };
    if (req.file) data.photo = '/uploads/' + req.file.filename;
    else data.photo = emp.photo;
    await Employee.updateProfile(req.session.user.id_employee, data);
    req.flash('success', 'Профиль обновлён');
    res.redirect('/profile');
  } catch (err) { next(err); }
};
