const router = require('express').Router();
const ctrl   = require('../controllers/authController');

router.get('/',       (req, res) => res.redirect('/employees'));
router.get('/login',  ctrl.getLogin);
router.post('/login', ctrl.postLogin);
router.get('/logout', ctrl.logout);

module.exports = router;
