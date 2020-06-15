module.exports.requireAuth = function(req, res, next) {
  // console.log('Cookie: ');
  // console.log(req.cookies.userId);
  if(!req.signedCookies.userId) {
    res.redirect('/user/login');
    return;
  }
  
  var db = require('../db');
  var user = db.get('users').find({id: req.signedCookies.userId}).value();
  var errors = [];
  if(!user.email) {
    errors.push('Name is not required');
    res.redirect('/user/login');
    return;
  }
  next();
}