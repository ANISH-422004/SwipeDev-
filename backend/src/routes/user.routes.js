const router = require('express').Router();
const userController = require('../controllers/user.controller');
const upload = require('../utils/multer'); // Multer middleware
const userMiddleware = require('../middlewares/user.middleware'); // Validation middleware

// Signup Route
router.post(
    "/signup",
    upload.single("profilePic"),
    userMiddleware.normalizeSkills, 
    userMiddleware.validateUserSignup,
    userController.signupUser
  );
  

// Add other user routes here (login, get profile, update profile etc.)
// router.post("/login", userController.loginUser);
// router.get("/profile", authMiddleware, userController.getUserProfile); // Example with auth

module.exports = router;