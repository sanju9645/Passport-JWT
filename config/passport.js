const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: PUB_KEY,
//   algorithms: ['RS256']
// };

const options = {
  jwtFromRequest: (req) => req.cookies.jwt,
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

/*
Passport should take the token from the Authorization header. 
If you have a client side, you send the token back to it, and the client side can then set the token on the Authorization header.

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

Here, jwtFromRequest extracts the token from the header. 
If we follow this approach, in the issueJWT() function in lib/utils...

return {
  token: "Bearer " + signedToken,
  expires: expiresIn
}

the token should be like this.

And the login route will be,

router.post('/login', function(req, res, next){
  User.findOne({ username: req.body.username })
        .then((user) => {
          if (!user) {
              return res.status(401).json({ success: false, msg: "could not find user" });
          }
          const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
          if (isValid) {
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


If you don't have a client side, and only server side, we can't follow this approach. 
Instead, we need to set the token on a cookie. 
So, we tell the middleware to use authentication with the token from the cookie. The options for this would be...

const options = {
  jwtFromRequest: (req) => req.cookies.jwt,
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

And the issueJWT() function, lib/utils

function issueJWT(user) {
  const _id = user._id;
  const expiresIn = '1d';
  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: signedToken,
    expires: expiresIn
  }
}

And the loin route will be,
router.post('/login', function(req, res, next){
  User.findOne({ username: req.body.username })
        .then((user) => {
          if (!user) {
              return res.status(401).json({ success: false, msg: "could not find user" });
          }
          const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

          if (isValid) {
              const tokenObject = utils.issueJWT(user);
              res.cookie('jwt', tokenObject.token, { httpOnly: true, secure: true });
              res.redirect('/users/protected');
          } else {
            res.status(401).json({ success: false, msg: "you entered the wrong password" });
          }
        })
        .catch((err) => {
            next(err);
        });
});
*/


// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
  // The JWT payload is passed into the verify callback
  passport.use(new JwtStrategy(options, function(jwt_payload, done) {
      console.log(jwt_payload);
      
      // We will assign the `sub` property on the JWT to the database ID of user
      User.findOne({_id: jwt_payload.sub})
        .then((user) => {  
          // This flow look familiar?  It is the same as when we implemented
          // the `passport-local` strategy
          if (!user) { 
            return done(null, false); 
          }

          if (user) {
              return done(null, user);
          } else {
              return done(null, false);
          }
        })
        .catch((err) => {   
            done(err);
        });
      })
)};