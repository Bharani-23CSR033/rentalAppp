// routes/owner.js
const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const upload = require('../middleware/upload');
const ownerController = require('../controllers/houseController');

const { 
  houseCreateValidator, 
  houseUpdateValidator, 
  ownerDecisionValidator 
} = require('../utils/validators');

const { validationResult } = require('express-validator');

const router = express.Router();

// validation handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// OWNER AUTH MIDDLEWARE
router.use(auth, requireRole('owner'));

// Create a house (with photos)
router.post(
  '/house',
  upload.array('photos', 6),
  houseCreateValidator,
  handleValidation,
  ownerController.createHouse
);

// Update house
router.put(
  '/house/:id',
  upload.array('photos', 6),
  houseUpdateValidator,
  handleValidation,
  ownerController.updateHouse
);

// Get requests for a house
router.get('/house/requests/:houseId', ownerController.getRequests);

// Accept request
router.post(
  '/house/accept',
  ownerDecisionValidator,
  handleValidation,
  ownerController.acceptRequest
);

// Reject request
router.post(
  '/house/reject',
  ownerDecisionValidator,
  handleValidation,
  ownerController.rejectRequest
);

module.exports = router;
