const mongoose = require("mongoose");

//const URL =

//mongos atlas connection string
// connection string is the url of the database where the database is hosted

//const URL = process.env.MONGODB_URL;
const URL = process.env.MONGODB_URL;

const mongodb = async () => {
  try {
    await mongoose.connect(URL, {});
    console.log("connected to database");
  } catch (error) {
    console.log({ messege: "Error in connecting to database" });
  }
};
module.exports = mongodb;
