const router = require('express').Router();
const ctrl   = require('../controllers/departmentController');
const auth   = require('../middleware/auth');
const roles  = require('../middleware/roles');

const MOD = roles('Администратор', 'Модератор');

router.get('/',             auth, ctrl.index);
router.get('/new',          auth, MOD, ctrl.createForm);
router.post('/',            auth, MOD, ctrl.create);
router.get('/:id/edit',     auth, MOD, ctrl.editForm);
router.post('/:id/update',  auth, MOD, ctrl.update);
router.post('/:id/delete',  auth, MOD, ctrl.delete);

module.exports = router;
