var db = require('../db');
var shortid = require('shortid');

module.exports.index = function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  var cart = db.get('sessions').find({id: sessionId}).value().cart;
  console.log(cart);
  var carts = [];
  for(var key in cart) {
    carts.push(
      { 
        book: db.get('books').find({id: key}).value(),
        count: cart[key]   
      }
    )
  }
  
  console.log(carts);
  
  res.render('cart/index', {
    carts: carts
  });
}

module.exports.post = function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  var userId = req.signedCookies.userId;
  
  var cart = db.get('sessions').find({id: sessionId}).value().cart;
  console.log(cart);
  var carts = [];
  for(var key in cart) {
    carts.push(
      { 
        book: db.get('books').find({id: key}).value(),
        count: cart[key]   
      }
    )
  }
  
  for(var cart of carts) {
    var newTransaction = {
    id: shortid.generate(),
    userId: userId,
    bookId: cart.book.id,
    isComplete: false
    };

    db.get('transactions').push(newTransaction).write();
  }
  
  db.get('sessions')
  .find({id: sessionId })
  .assign({ cart: {} })
  .write()
  console.log(db.get('sessions').find({id: sessionId}).value());
  res.redirect('/');
}

module.exports.addToCart = function(req, res) {
  var idBook = req.params.bookId;
  var sessionId = req.signedCookies.sessionId;
  
  var count = db.get('sessions').find({id: sessionId}).get('cart.' + idBook, 0);
  
  db.get('sessions').find({id: sessionId})
  .set('cart.' + idBook, count + 1)
  .write();
  
  console.log(db.get('sessions').value());
  res.redirect('/book');

}
