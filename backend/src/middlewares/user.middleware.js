const { body } = require("express-validator");

exports.validateUserSignup = [
  body("firstName")
    .isLength({ min: 2, max: 50 }).withMessage("First name must be 2-50 chars"),
  body("lastName")
    .isLength({ min: 2, max: 50 }).withMessage("Last name must be 2-50 chars"),
  body("email")
    .isEmail().withMessage("Enter valid email"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("age")
    .isInt({ min: 18, max: 100 }).withMessage("Age must be between 18 and 100"),
  body("gender")
    .isIn(["male", "female", "other"]).withMessage("Invalid gender"),
  body("skills")
    .isArray().withMessage("Skills must be an array")
    .custom((skills) => {
      if (skills.length > 10) throw new Error("Max 10 skills allowed");
      skills.forEach(s => {
        if (typeof s !== 'string' || s.length > 50)
          throw new Error("Each skill must be string of max 50 chars");
      });
      return true;
    }),
];

exports.validateUserLogin = [
  body("email")
    .isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

// In a middleware before validation
module.exports.normalizeSkills = function(req, res, next) {
  if (typeof req.body.skills === "string") {
    try {
      req.body.skills = JSON.parse(req.body.skills);
    } catch { 
      // Do nothing, express-validator will catch it
    }
  }
  next();
}
