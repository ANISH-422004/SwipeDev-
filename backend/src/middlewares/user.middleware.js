const { body } = require("express-validator");
const userModel = require("../models/user.model");

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


module.exports.authMe = async (req, res , next) => {
  try{
      const token = req.header("Authorization")?.split(" ")[1]
      if(!token) return res.status(401).json({message: "Unauthorized"})
      const isVerifiedToken = await userModel.verifyToken(token)
      if(!isVerifiedToken) return res.status(401).json({message: "Unauthorized"})
        const user = await userModel.findById(isVerifiedToken.id).select("-password -__v")
      if(!user) return res.status(404).json({message: "User not found"})

      req.user = user
      
          
      next()
  }catch(err){
      console.error(err)
      return res.status(500).json({message: "Internal Server Error"})
  }
}