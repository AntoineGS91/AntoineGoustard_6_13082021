// Import express
const express = require('express');

// Création router
const router = express.Router();

// Import middleware Auth
const auth = require('../middleware/auth')

// Import middleware Multer
const multer = require('../middleware/multer-config');

// Import controller Sauce
const sauceCtrl = require('../controllers/sauce');

// ROUTES
router.post('/', auth, multer, sauceCtrl.createSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.get('/', auth, sauceCtrl.getAllSauces)
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;