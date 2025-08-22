const express = require('express');
const router = express.Router(); // ✅ built-in Express Router

const loginController = require('../controllers/loginController');

router.post('/', loginController.handleLogin); // ✅

module.exports = router;
