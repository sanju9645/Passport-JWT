const mongoose = require('mongoose');
const router = require('express').Router();   
const passport = require('passport');

const User = require('../models/User');
const utils = require('../lib/utils');

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
  // res.send('<h2>You are successfully authenticated to this route! !</h2>  --> <a href="/register">Login</a>');
});

router.post('/login', function(req, res, next){
  User.findOne({ username: req.body.username })
        .then((user) => {
          if (!user) {
              return res.status(401).json({ success: false, msg: "could not find user" });
          }
          // Function defined at bottom of app.js
          const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
          console.log(isValid);

          if (isValid) {
          console.log(isValid);
              const tokenObject = utils.issueJWT(user);
              res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
          } else {
            res.status(401).json({ success: false, msg: "you entered the wrong password" });
          }
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/register', function(req, res, next){
  const saltHash = utils.genPassword(req.body.password);
    
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt
  });

  try {
    newUser.save()
      .then((user) => {
          // res.json({ success: true, user: user });
          res.redirect('/login');
      });
  } catch (err) {
    // res.json({ success: false, msg: err });
    res.send('<h2>There was an error creating user, please try again !</h2>  --> <a href="/register">Login</a>');
  }
});

module.exports = router;