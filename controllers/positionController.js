const Position = require('../models/Position');

exports.index = async (req, res, next) => {
  try {
    const positions = await Position.getAll();
    res.render('positions/index', { title: 'Должности', positions });
  } catch (err) { next(err); }
};

exports.createForm = (req, res) => {
  res.render('positions/form', { title: 'Новая должность', pos: {}, action: '/positions' });
};

exports.create = async (req, res, next) => {
  try {
    if (!req.body.position_name) {
      req.flash('error', 'Введите название должности');
      return res.redirect('/positions/new');
    }
    await Position.create(req.body);
    req.flash('success', 'Должность добавлена');
    res.redirect('/positions');
  } catch (err) { next(err); }
};

exports.editForm = async (req, res, next) => {
  try {
    const pos = await Position.getById(req.params.id);
    if (!pos) { req.flash('error', 'Должность не найдена'); return res.redirect('/positions'); }
    res.render('positions/form', {
      title: 'Редактировать должность', pos,
      action: '/positions/' + pos.id_position + '/update'
    });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await Position.update(req.params.id, req.body);
    req.flash('success', 'Должность обновлена');
    res.redirect('/positions');
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await Position.delete(req.params.id);
    req.flash('success', 'Должность удалена');
    res.redirect('/positions');
  } catch (err) { next(err); }
};
