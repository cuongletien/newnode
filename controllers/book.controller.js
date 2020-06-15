var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'nnhungcoderx', 
  api_key: '874846159413379', 
  api_secret: 'LnPTZP8dDOKQVlIup17uxKACmto' 
});

var db = require('../db');
var shortid = require('shortid');

module.exports.index = function(req, res){
  var books = db.get('books').value();
  res.render('book/index', {
    books: books
  })
};

module.exports.search = function(req, res) {
  var q = req.query.q;
  console.log(q);
  var searchBooks = db.get('books').value().filter(function(book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  }); 
  res.render('book/index', {
    books: searchBooks,
    value: q
  })
};

module.exports.delete = function(req, res){
  var id = req.params.id;
  db.get('books').remove({id: id}).write();
  res.redirect('/book');
};

module.exports.indexUpdate = function(req, res){
  var id = req.params.id;
  var book = db.get('books').find({id: id}).value();
  res.render('book/update', {
    book: book
  });
};

module.exports.onUpdate = function(req, res) {
  var id = req.params.id;
  var input = req.body.title;
  db.get('books')
    .find({id: id})
    .assign({title: input}).write();
  console.log(db.get('books').value());
  res.redirect('/book');
};

module.exports.create = function(req, res) {
  var title = req.body.title;
  var desc = req.body.desc;
  var id = shortid.generate();
  var file = req.files.coverUrl;
  console.log(req.files.coverUrl);
  cloudinary.uploader.upload(file.tempFilePath, 
    function(error, result) {
      var newBook = {
        id: id,
        title: title,
        desc: desc,
        image: result.url
      };
      db.get('books').push(newBook).write();
  });
  res.redirect('/book');
};

module.exports.view = function(req, res) {
  var id = req.params.id;
  res.render('book/view', {
    book: db.get('books').find({id: id}).value()
  });
};