# Passport-JWT
Passport JWT Strategy Flow (Node + Passport + Express + MongoDB)


Our Options

1. Most Complex
   Use the NodeJS cripto library and write our own middleware to sign and verify JWTs

2. Somewhat Complex
   Use the jsonwebtoken NPM module and wite our own middleware

3. Least Complex
   Use the jsonwebtoken NPM module and use passport-jwt as our middleware


The JWT Authentication Process
1. User logs in to web app, and is issued a JSON Web Token (JWT)
2. User client (usually a browser like google chrome) stores the JWT in local storage or a cookie
3. On every HTTP request that requires authentication, the user client (browser) will attch the JWT in the 'Autherization' HTTP header
4. The server looks for the JWT in the 'Autherization' HTTP header and verifies the signature
5. If the signature is valid, the server decodes the JWT, usually gets the database ID of the user in the 'payload.sub' field.
looks the user up in the DB, and store the user object to use.
6. The user recieves the route data



1. Initialize a New Project:
  npm init -y

2. Install all dependencies

  npm i body-parser connect-mongo dotenv express express-session mongoose passport passport-jwt cors cookie-parser

3. Install developer depencies
  npm i nodemon --save-dev

4. Create .env file

5. Create a .gitignore file
  add the following contents
  
  node_modules/
  .env

6. Update Package.json Scripts:
  Modify the "scripts" section in package.json to include start and dev commands.

"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "app.js",
  "dev": "nodemon app.js"
}

7. Setup app.js File:

8. Run the generateKeypair.js to generate the pvt and public keys




Passport should take the token from the Authorization header. 
If you have a client side, you send the token back to it, and the client side can then set the token on the Authorization header.

config/passport.js

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
Also install the cookie-parser package

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