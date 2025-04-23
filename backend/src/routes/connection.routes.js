const router = require('express').Router();
const connectionController = require('../controllers/connection.controller');
const { authMe } = require('../middlewares/user.middleware');

router.get('/connections/recived',authMe ,connectionController.getPendingConnectionsController); 
router.get('/connections', authMe ,connectionController.getAllConnectionController); //see
// router.get('/feed', getUserFeedController); 




module.exports = router