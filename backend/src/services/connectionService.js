const connectionRequestModel = require("../models/connectionRequest.model");


// Fetch all connections for the logged-in user
module.exports.getConnections = async (userId) => {
    try {
        // Assuming you have a Connection model to interact with your database
        const connections = await connectionRequestModel.find({ receiverId: userId }).populate('senderId' , "firstName lastName email age gender profilePic"); // Populate with user details

        return connections;
    } catch (error) {
        console.error("Error fetching connections:", error);
        throw new Error("Error fetching connections");
    }
}