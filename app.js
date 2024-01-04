const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB =  require('./config/database');
const cookieParser = require('cookie-parser');

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

const PORT = process.env.PORT || 3000;

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
connectDB();

// Must first load the models
require('./models/User');

// Pass the global passport object into the configuration function
require('./config/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Use cookie-parser middleware
app.use(cookieParser());

app.use(cors());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(require('./routes'));

const errorHandler = (err, req, res, next) => {
  if (err) {
    res.send("<h2>There was an error, please try again !</h2>");
  }
}

// app.use(errorHandler);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:PORT
app.listen(PORT, () => {
  console.log(`APP listening on port ${PORT}`);
});
