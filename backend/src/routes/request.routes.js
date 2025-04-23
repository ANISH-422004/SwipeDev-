const { authMe } = require('../middlewares/user.middleware');
const requestController = require('../controllers/request.controller');
const router = require('express').Router();


//send connection request to a user
router.post("/send/:status/:toUserId", authMe , requestController.sendConnectionRequestController)


//for responding to a connection request
router.post("/review/:requestId/:status", authMe , async (req, res) => {

})





module.exports = router;