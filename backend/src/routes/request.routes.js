const { authMe } = require('../middlewares/user.middleware');
const connectionRequestModel = require('../models/connectionRequest.model');

const router = require('express').Router();


//send connection request to a user
router.post("/:status/:toUserId", authMe , async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const { _id : userId } = req.user; 

        // Check if the status is valid
        if (!["ignored", "intrested"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Check if the sender and receiver are the same
        if (userId === toUserId) {
            return res.status(400).json({ message: "You cannot send a request to yourself" });
        }

        // check if the connection request already exists
        const existingRequest = await connectionRequestModel.findOne({
            senderId: userId,
            receiverId: toUserId,
        });

        


        // Create a new connection request
        const connectionRequest = await connectionRequestModel.create({
            senderId: userId,
            receiverId: toUserId,
            status: status,
        });

        return res.status(200).json({ message: "Connection request sent successfully", connectionRequest });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }


})




module.exports = router;