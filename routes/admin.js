const router = require('express').Router();
const auth   = require('../middleware/auth');
const roles  = require('../middleware/roles');

const ADMIN = roles('Администратор');

router.get('/', auth, ADMIN, (req, res) => {
  res.render('admin/index', { title: 'Администрирование' });
});

module.exports = router;
