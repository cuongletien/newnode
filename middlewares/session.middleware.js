var shortid = require('shortid');
var db = require('../db');

module.exports = function(req, res, next) {
  
  if(!req.signedCookies.sessionId) {
    // console.log(req.signedCookies);
    console.log(1);
    var sessionId = shortid.generate();
    res.cookie('sessionId', sessionId, {
        signed: true
      });
    db.get('sessions').push({id: sessionId}).write();
    // console.log(db.get('sessions').value());
  }

  var cart = db.get('sessions').find({id: req.signedCookies.sessionId}).value().cart;
  console.log(cart);
  var count = 0;
  for(var key in cart) {
    count += cart[key] 
  }
  
  res.locals.count = count ;
  
  next();
  
}