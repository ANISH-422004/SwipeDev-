const router = require('express').Router();
const connectionController = require('../controllers/connection.controller');
const { authMe } = require('../middlewares/user.middleware');

router.get('/connections',authMe ,connectionController.getConnectionsController); // Existing connections
// router.get('/requests', getConnectionRequestsController); // All requests
// router.get('/feed', getUserFeedController); // All profiles feed




module.exports = router