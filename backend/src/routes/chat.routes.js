const router = require('express').Router();
const chatController = require('../controllers/chat.controller');
const { authMe } = require('../middlewares/user.middleware');

// GET /api/chat/:targetUserId
router.get("/:targetUserId", authMe , chatController.getAllChatsOfUser);
  


module.exports = router;