const connectionRequestModel = require("../models/connectionRequest.model");

// check if the connection request already exists
module.exports.checkifConnectionRequestExists = async (senderId, receiverId) => {
    const existingRequest = await connectionRequestModel.findOne({
        senderId: senderId,
        receiverId: receiverId,
    });
    return existingRequest;
}

// Create a new connection request
module.exports.createConnectionRequest = async (senderId, receiverId, status) => {
    const connectionRequest = await connectionRequestModel.create({
        senderId,
        receiverId,
        status,
    });

    if (!connectionRequest) {
        throw new Error("Connection request creation failed");
    }

    return connectionRequest;
}