const Department = require('../models/Department');
const Employee   = require('../models/Employee');

exports.index = async (req, res, next) => {
  try {
    const departments = await Department.getAll();
    res.render('departments/index', { title: 'Отделы', departments });
  } catch (err) { next(err); }
};

exports.createForm = async (req, res, next) => {
  try {
    const employees = await Employee.getAll();
    res.render('departments/form', { title: 'Новый отдел', dept: {}, employees, action: '/departments' });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.body.department_name) {
      req.flash('error', 'Введите название отдела');
      return res.redirect('/departments/new');
    }
    await Department.create(req.body);
    req.flash('success', 'Отдел создан');
    res.redirect('/departments');
  } catch (err) { next(err); }
};

exports.editForm = async (req, res, next) => {
  try {
    const [dept, employees] = await Promise.all([Department.getById(req.params.id), Employee.getAll({ department: req.params.id })]);
    if (!dept) { req.flash('error', 'Отдел не найден'); return res.redirect('/departments'); }
    res.render('departments/form', {
      title: 'Редактировать отдел', dept, employees,
      action: '/departments/' + dept.id_department + '/update'
    });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await Department.update(req.params.id, req.body);
    req.flash('success', 'Отдел обновлён');
    res.redirect('/departments');
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await Department.delete(req.params.id);
    req.flash('success', 'Отдел удалён');
    res.redirect('/departments');
  } catch (err) { next(err); }
};
