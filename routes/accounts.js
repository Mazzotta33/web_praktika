const router = require('express').Router();
const ctrl   = require('../controllers/accountController');
const auth   = require('../middleware/auth');
const roles  = require('../middleware/roles');

const ADMIN = roles('Администратор');

router.get('/',               auth, ADMIN, ctrl.index);
router.get('/new',            auth, ADMIN, ctrl.createForm);
router.post('/',              auth, ADMIN, ctrl.create);
router.post('/:id/deactivate',auth, ADMIN, ctrl.deactivate);
router.post('/:id/activate',  auth, ADMIN, ctrl.activate);
router.post('/:id/role',      auth, ADMIN, ctrl.changeRole);

module.exports = router;
