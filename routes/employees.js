const router = require('express').Router();
const ctrl   = require('../controllers/employeeController');
const auth   = require('../middleware/auth');
const roles  = require('../middleware/roles');
const path   = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype))
});

const MOD = roles('Администратор', 'Модератор');

router.get('/',               auth,      ctrl.index);
router.get('/profile',        auth,      ctrl.profileForm);
router.post('/profile',       auth,      upload.single('photo'), ctrl.profileUpdate);
router.get('/new',            auth, MOD, ctrl.createForm);
router.post('/',              auth, MOD, upload.single('photo'), ctrl.create);
router.get('/:id',            auth,      ctrl.show);
router.get('/:id/edit',       auth, MOD, ctrl.editForm);
router.post('/:id/update',    auth, MOD, upload.single('photo'), ctrl.update);
router.post('/:id/delete',    auth, MOD, ctrl.delete);

module.exports = router;
