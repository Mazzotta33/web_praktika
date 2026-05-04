module.exports = (...allowed) => (req, res, next) => {
  if (!req.session.user || !allowed.includes(req.session.user.role)) {
    req.flash('error', 'Недостаточно прав доступа');
    return res.redirect('/employees');
  }
  next();
};
