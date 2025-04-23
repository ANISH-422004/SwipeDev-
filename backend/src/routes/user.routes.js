const router = require('express').Router();
const userController = require('../controllers/user.controller');
const upload = require('../utils/multer'); // Multer middleware
const userMiddleware = require('../middlewares/user.middleware'); // Validation middleware


// Get user Profile
router.get("/profile", userMiddleware.authMe, userController.getUserProfile);

// Get all users
router.get("/all", userMiddleware.authMe, userController.getAllUsers);


// Update User Route
router.patch(
  "/update",
  userMiddleware.authMe,
  upload.single("profilePic"),
  userMiddleware.normalizeSkills,
  userController.updateUser
);

//Delete User Route
router.delete(
  "/delete",
  userMiddleware.authMe,
  userController.deleteUser
);

//forgot password route
router.post(
  "/forgot-password",
  userMiddleware.authMe,
  userController.forgotPassword
);

//reset password route
router.post(
  "/reset-password",
  userController.resetPassword
);


module.exports = router;