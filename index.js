require("dotenv").config(); //importing the dotenv package to use the environment variables
const express = require("express");

// create an express app instance
const app = express();

//importing the server router files
const router = require("./server/auth-router");

//import the database connection
const mongodb = require("./server/utils/db");

//parse the requst body to json object
app.use(express.json());

//import the router
app.use("/api/auth", router);

// import the controller
const authcontrollers = require("./server/controller/auth-controlle");

const PORT = 8000;
router.route("/").get(authcontrollers.home);
router.route("/register").post(authcontrollers.register);
router.route("/login").post(authcontrollers.login);

//connecting to database and starting the server
mongodb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
});
