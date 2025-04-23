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

// Login Route
router.post(
  "/login",
  userMiddleware.validateUserLogin,
  userController.loginUser
);

// Update User Route
router.put(
  "/update",
  userMiddleware.authMe,
  upload.single("profilePic"),
  userMiddleware.normalizeSkills,
  userController.updateUser
);

router.get("/profile", userMiddleware.authMe, userController.getUserProfile);

module.exports = router;