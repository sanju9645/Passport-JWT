require('dotenv').config();
const mongoose = require('mongoose');

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:3000/database_name
 */
const connectDB = async () => {
  let conn = '';
  try {
    mongoose.set('strictQuery', false);
    conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
  return conn;
}

module.exports = connectDB;