const express = require('express')

const {Signup, Login, Logout} = require("../controllers/userController")

const router = express.Router();

//Signup Route
router.post("/signup", Signup)

//Login Route
router.post("/login", Login)

//Logout Route
router.post("/logout", Logout)

module.exports = router