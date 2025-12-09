// routes/user.js
const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const userController = require('../controllers/requestController');

const { 
  createRequestValidator, 
  withdrawRequestValidator 
} = require('../utils/validators');

const { validationResult } = require('express-validator');

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ALL USER ROUTES REQUIRE USER ROLE
router.use(auth, requireRole('user'));

// Get all available houses
router.get('/houses', userController.getAvailableHouses);

// Create a request (Select a house)
router.post(
  '/request',
  createRequestValidator,
  handleValidation,
  userController.createRequest
);

// Withdraw request (Unselect)
router.delete(
  '/request/:houseId',
  withdrawRequestValidator,
  handleValidation,
  userController.withdrawRequest
);

// Get booked house
router.get('/myhouse', userController.getMyHouse);

// Get rejected houses
router.get('/rejected', userController.getRejected);

module.exports = router;
