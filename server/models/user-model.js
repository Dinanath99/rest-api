const mongoose = require("mongoose");
const becrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    require: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//secure the password using bcryptjs
// pre method is used to perform the operation before savind the data in databse
// pre method takes two parameter first is the event and second is the function
userSchema.pre("save", async function (next) {
  const user = this;

  // if password is not modified then return next
  if (!user.isModified("password")) {
    return next(); //next is used to called the next middle ware or next operation
  }

  //
  try {
    //hash the password
    const saltRound = await becrypt.genSalt(10); // generate the sal
    const hash_Password = await becrypt.hash(user.password, saltRound); //hash the password

    // replace the password with hash pasword
    user.password = hash_Password;
  } catch (error) {
    next(error);
  }
});

// json web token
//jwt used to create the token
// jwt stored the data in cookies or local storage

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
