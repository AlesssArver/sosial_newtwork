const router = require('express').Router()
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

router.get('/login', forwardAuthenticated, (req, res) => { 
  res.render('login', { notAuth: !req.isAuthenticated() }) 
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register', { notAuth: !req.isAuthenticated() })
});

router.post('/register', (req, res) => {
  const { name, surname, email, phone, password } = req.body;

  let errors = [];

  if (!name || !surname || !email || !phone || !password) errors.push({ msg: 'Please enter all fields' });
  if (password.length < 6) errors.push({ msg: 'Password must be at least 6 characters' });
  if (errors.length > 0) res.render('register', { errors, name, surname, email, phone, password })
  User.findOne({ email: email }).then(user => {
    if (user) {
      errors.push({ msg: 'Email already exists' });
      res.render('register', { errors, name, surname, email, phone, password });
    } 
    const newUser = new User({ name, surname, email, phone, password });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          req.flash(
            'success_msg',
            'You are now registered and can log in'
          );
          res.redirect('/login');
        })
          .catch(err => console.log(err));
      });
    })
  })
  res.redirect(`/login`)
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;
