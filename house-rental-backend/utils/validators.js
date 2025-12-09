// utils/validators.js
const { body, param } = require("express-validator");

/* ==========================
   AUTH VALIDATORS
========================== */

exports.signupValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

  body("email")
    .isEmail().withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["owner", "user"]).withMessage("Role must be owner or user")
];


exports.loginValidator = [
  body("email")
    .isEmail().withMessage("Valid email required"),

  body("password")
    .notEmpty().withMessage("Password required"),
];


/* ==========================
   HOUSE VALIDATORS (Owner)
========================== */

exports.houseCreateValidator = [
  body("title")
    .notEmpty().withMessage("Title required"),

  body("cost")
    .isNumeric().withMessage("Cost must be a number"),

  body("location")
    .notEmpty().withMessage("Location required"),

  body("furnishing")
    .optional()
    .isString().withMessage("Furnishing must be a string"),

  body("isAvailable")
    .optional()
    .isBoolean().withMessage("isAvailable must be true/false")
];


exports.houseUpdateValidator = [
  body("title").optional().isString(),
  body("cost").optional().isNumeric(),
  body("location").optional().isString(),
  body("description").optional().isString(),
  body("furnishing").optional().isString(),
  body("isAvailable").optional().isBoolean()
];


/* ==========================
   REQUEST VALIDATORS (User)
========================== */

exports.createRequestValidator = [
  body("houseId")
    .notEmpty().withMessage("houseId is required")
    .isMongoId().withMessage("Invalid houseId")
];

exports.withdrawRequestValidator = [
  param("houseId")
    .isMongoId().withMessage("Invalid houseId")
];

exports.ownerDecisionValidator = [
  body("houseId")
    .notEmpty().withMessage("houseId is required")
    .isMongoId().withMessage("Invalid houseId"),

  body("userId")
    .notEmpty().withMessage("userId is required")
    .isMongoId().withMessage("Invalid userId")
];

