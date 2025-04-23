const { checkifConnectionRequestExists, createConnectionRequest } = require("../services/RequestService");

module.exports.sendConnectionRequestController = async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const { _id: userId } = req.user; 
        
        // Validate status
        if (!["ignored", "intrested"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Prevent sending request to self
        if (userId === toUserId) {
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
