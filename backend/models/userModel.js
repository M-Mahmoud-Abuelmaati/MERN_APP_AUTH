const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const accessToken = jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "2m",
  });
  return { accessToken, refreshToken };
};

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
});

userSchema.statics.register = async function (name, email, password) {
  if (!name || !email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  const createdUser = await this.create({
    name,
    email,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = createToken(createdUser._id);

  createdUser.accessToken = accessToken;
  createdUser.refreshToken = refreshToken;
  createdUser.save();

  return createdUser;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  const { accessToken, refreshToken } = createToken(user._id);

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  user.save();

  return user;
};
module.exports = mongoose.model("User", userSchema);
