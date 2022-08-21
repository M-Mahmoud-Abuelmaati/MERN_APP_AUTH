const express = require('express');

const {Services} = require('../controllers/servicesController')
const {requireAuth} = require('../middleware/authMiddleware')

const router = express.Router();

//Require Authentication
router.use(requireAuth)

//Get Services
router.get('/', Services)

module.exports = router;