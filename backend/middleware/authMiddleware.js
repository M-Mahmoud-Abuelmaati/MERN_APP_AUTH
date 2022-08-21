const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required!" });
  }


  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id });
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      res.status(401).json({ error: "access token expired" });
    } else {
      res.status(401).json({ error: "Request is not authorized" });
    }
  }
};

const refreshToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required!" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    const newToken = jwt.sign({ _id }, process.env.SECRET, {
      expiresIn: "1m",
    });

    const user = await User.findOne({ _id });

    user.accessToken = newToken;
    user.save();
    req.user = user._id;
    res.status(200).json({ user });
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      res.status(401).json({ error: "refresh token expired" });
    } else {
      res.status(401).json({ error: "Request is not authorized" });
    }
  }
};

module.exports = { requireAuth, refreshToken };
