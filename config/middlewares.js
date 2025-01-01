const logout_check = ((req, res, next) => {
  if (req.path === '/login.html' && req.isAuthenticated()) {
    return res.redirect('/dashboard?alert=logout-first');
  }
  if (req.path === '/registration-form.html' && req.isAuthenticated()) {
    return res.redirect('/dashboard?alert=logout-first');
  }
  if (req.path === '/reset-password.html' && req.isAuthenticated()) {
    return res.redirect('/dashboard?alert=logout-first');
  }
  if (req.path === '/forgot-password.html' && req.isAuthenticated()) {
    return res.redirect('/dashboard?alert=logout-first');
  }
  if (req.path === '/contact-us.html' && req.isAuthenticated()) {
    return res.redirect('/dashboard?alert=logout-first');
  }
  next();
});

module.exports = logout_check;