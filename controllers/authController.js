const Account = require('../models/Account');

exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/employees');
  res.render('login', { title: 'Вход в систему' });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      req.flash('error', 'Введите логин и пароль');
      return res.redirect('/login');
    }
    const account = await Account.findByLogin(login);
    if (!account) {
      req.flash('error', 'Неверный логин или пароль');
      return res.redirect('/login');
    }
    if (!account.is_active) {
      req.flash('error', 'Учётная запись деактивирована');
      return res.redirect('/login');
    }
    const valid = await Account.verifyPassword(password, account.password_hash);
    if (!valid) {
      req.flash('error', 'Неверный логин или пароль');
      return res.redirect('/login');
    }
    req.session.user = {
      id_account:  account.id_account,
      id_employee: account.id_employee,
      login:       account.login,
      role:        account.role_name,
      full_name:   account.full_name
    };
    res.redirect('/employees');
  } catch (err) { next(err); }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
