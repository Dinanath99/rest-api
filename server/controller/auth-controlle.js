const UserModel = require("../models/user-model");
const becrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*  
home logic
*/
const home = async (req, res) => {
  try {
    res.status(200).send("welcome to home page using controller");
  } catch (error) {
    res.status(400).send({ messege: "page not found" });
  }
};

// registration logic

const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
      return res.status(400).send({ messege: "Please fill the data" });
    }
    const useremail = await UserModel.findOne({
      email: email,
    });

    //check if user already exits or not by email
    if (useremail) {
      return res.status(400).send({ messege: "user already exits" });
    }

    //create new user if not exits
    const userCreated = await UserModel.create({
      name,
      email,
      password,
      address,
    });
    console.log(userCreated);
    res.status(200).send({
      messege: "Registration successfull",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

// ****      Login Route *******

const login = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    if (!email || !password) {
      return res.status(400).send({ messege: "please fill the data" });
    }
    //getting user email from database
    const user = await UserModel.findOne({ email: email });

    //checking user exist or not
    if (!user) {
      return res.status(400).send({ messege: "user not found" });
    }

    // matching the password
    const isMatch = await becrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ messege: "password does not match" });
    }
    const secret_key = process.env.JWT_SECRET_KEY;

    const token = jwt.sign({ userId: user._id }, secret_key);

    if (user) {
      res.status(200).send({ messege: "login successfull", token });
    }
  } catch (error) {
    res.status(400).send({ messege: "invalid credentials", error });
    console.log(error);
  }
};

//export the module
module.exports = { home, register, login };
