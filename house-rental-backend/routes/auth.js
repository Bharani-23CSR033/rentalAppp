// routes/auth.js
const express = require('express');
const { signupValidator, loginValidator } = require('../utils/validators');
const authController = require('../controllers/authController');
const { validationResult } = require('express-validator');

const router = express.Router();

// middleware to handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Signup
router.post('/signup', signupValidator, handleValidation, authController.signup);

// Login
router.post('/login', loginValidator, handleValidation, authController.login);

module.exports = router;
