var cloudinary = require('cloudinary').v2;
// var fileUpload = require('express-fileupload');

var db = require('../db');
var shortid = require('shortid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

cloudinary.config({ 
  cloud_name: 'nnhungcoderx', 
  api_key: '874846159413379', 
  api_secret: 'LnPTZP8dDOKQVlIup17uxKACmto' 
});

module.exports.index = function(req, res) {
  res.render('user/index');
};

module.exports.create = function(req, res) {
  res.render('user/create')
};

module.exports.postCreate = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var id = shortid.generate();
  
  var errors = res.locals.errors;
  
  if(errors.length > 0) {
    res.render('user/create', {
      errors: errors,
      value: email
    })
    return;
  }
  
  bcrypt.hash(password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
    var hash = hash;
      var newUser = {
      id: id,
      email: email,
      password: hash,
      wrongLoginCount: 0,
      avatar: 'https://api.adorable.io/avatars/285/abott@adorable.png'
    };
    db.get('users').push(newUser).write();
  });
    res.redirect('/user/login');
}; 

module.exports.profile = function(req, res) {
  var id = req.params.id;
  var user = db.get('users').find( {id: id} ).value();
  console.log(user);
  res.render('user/profile', {
    user: user
  });
};

module.exports.avatar = function(req, res) {
  var id = req.params.id;
  var user = db.get('users').find({id:id}).value();
  res.render('user/avatar', {
    user: user
  })
}

module.exports.postAvatar = function(req, res) {
  var id = req.params.id;
  var user = db.get('users').find({id:id}).value();
//   const sgMail = require('@sendgrid/mail');

//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   // console.log(process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: 'nnhungjs@gmail.com',
//     from: 'nghiahunguet@gmail.com',
//     subject: 'Change Avatar',
//     text: 'Hey Bro!!!!!!!!!!!!!',
//     html: '<p>Changed Avatar</p> <a href="https://coders-x.com/"> Coders-X</a>',
//   };
//   sgMail
//     .send(msg)
//     .then((res) => {
//       console.log(res);
//     }, error => {
//       console.error(error);

//   if (error.response) {
//       console.error(error.response.body)
//     }
//   });
  var file = req.files.avatar;
  console.log(req.files.avatar);
  cloudinary.uploader.upload(file.tempFilePath, 
    function(error, result) {
      db.get('users')
      .find({ id: id})
      .assign({ avatar: result.url})
      .write()
    });
  res.redirect('/');
}


