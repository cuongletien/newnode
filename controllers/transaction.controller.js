var db = require('../db'); 
var shortid = require('shortid');

module.exports.index = function(req, res) {
  console.log(db.get('users').value());
  var isAdmin;
  var id = req.signedCookies.userId;
  if(db.get('users').find({id:id}).value().isAdmin) {
    isAdmin = true;
  }
  var transactions = db.get('transactions').value();
  console.log(transactions);
  let showTransactions = transactions.map(function(transaction) {
    let changeTransaction = {
      id: transaction.id,
      user: db.get('users').find( {id: transaction.userId} ).value().email,
      book: db.get('books').find( {id: transaction.bookId} ).value().title,
      isComplete: transaction.isComplete,
      isAdmin: db.get('users').find( {id: transaction.userId} ).value().isAdmin
    }
    return changeTransaction;
  })
  console.log(showTransactions);
  console.log(isAdmin);
  res.render('transaction/index', {
    showTransactions: showTransactions,
    isAdmin: isAdmin
  });
}

module.exports.create = function(req, res) {
  var users = db.get('users').value();
  var books = db.get('books').value();
  res.render('transaction/create', {
    users: users,
    books: books
  });
}

module.exports.postCreate = function(req, res) {
  console.log(req.body)
  var newTransaction = {
    id: shortid.generate(),
    userId: req.body.user,
    bookId: req.body.book,
    isComplete: false
  };
  
  db.get('transactions').push(newTransaction).write();
  console.log(db.get('transactions').value());
  res.redirect('/');
}


module.exports.complete = function(req, res) {
  let id = req.params.id;
  if(db.get('transactions').find({id})) {
    db.get('transactions').find({id}).assign({isComplete: true}).write();
  }
  res.redirect('/');
}