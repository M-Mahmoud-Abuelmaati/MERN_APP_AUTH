const User = require("../models/userModel");

const Signup = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.register(name, email, password);

    res.status(200).json({ user });
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ error: err.message });
  }
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    res.status(200).json({ user });
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ error: err.message });
  }
};

const Logout = async (req, res, next) => {
  res.json("Logout");
};

module.exports = {
  Login,
  Signup,
  Logout,
};
