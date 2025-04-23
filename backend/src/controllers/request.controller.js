const { checkifConnectionRequestExists, createConnectionRequest, findRequestByIdandReciverId, updateRequestStatus } = require("../services/RequestService");

module.exports.sendConnectionRequestController = async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const { _id: userId } = req.user; 
        
        // Validate status
        if (!["ignored", "intrested"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Prevent sending request to self
        if (userId.toString() === toUserId) {
            return res.status(400).json({ message: "You cannot send a request to yourself" });
        }

        // Check if request already exists
        const existingRequest = await checkifConnectionRequestExists(userId, toUserId);
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }

        // Create new connection request
        const connectionRequest = await createConnectionRequest(userId, toUserId, status);

        return res.status(200).json({ message: "Connection request sent successfully", connectionRequest });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports.respondToConnectionRequestController = async (req, res) => {
    try {
        const  loginUserId  = req.user._id; // Get the logged-in user's ID from the request object
        const { requestId, status } = req.params; // Extract ConnectionRequestId and status from the request parameters

        //validate status
        if (!["accept", "reject"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Check if the requestId is valid and belongs to the logged-in user
        const iftheRequestExists = await findRequestByIdandReciverId(requestId , loginUserId);

        if(!iftheRequestExists) {
            return res.status(400).json({ message: "Connection request not found or does not belong to you" });
        }

        // Update the status of the connection request and if not updated handeled in function

        const updatedRequest = await updateRequestStatus(requestId, status);


        return res.status(200).json({ message: "Connection request updated successfully", updatedRequest });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}