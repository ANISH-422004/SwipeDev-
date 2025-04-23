const upload = require('../utils/multer');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');
const authController = require('../controllers/auth.controller');
const router = require('express').Router();



// Signup Route
router.post(
  "/signup",
  upload.single("profilePic"),
  userMiddleware.normalizeSkills,
  authMiddleware.validateUserSignup,
  authController.signupUser
);

// Login Route
router.post(
  "/login",
  authMiddleware.validateUserLogin,
  authController.loginUser
);




module.exports = router;