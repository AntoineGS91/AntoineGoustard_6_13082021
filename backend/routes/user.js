// Import express
const express = require('express');

// Création router
const router = express.Router();

// Import controller User
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;