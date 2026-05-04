module.exports = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Необходимо войти в систему');
    return res.redirect('/login');
  }
  next();
};
