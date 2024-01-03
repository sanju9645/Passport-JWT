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

  npm i body-parser connect-mongo dotenv express express-session mongoose passport passport-jwt cors

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

