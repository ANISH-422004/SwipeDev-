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


//find request by id + reciverId
module.exports.findRequestByIdandReciverId = async (requestId , receiverId) => {
    const request = await connectionRequestModel.findById({_id: requestId , receiverId: receiverId});
    if (!request) {
        throw new Error("Connection request not found");
    }
    return request;
}


//updated the request status
module.exports.updateRequestStatus = async (requestId, status) => {
    const updatedRequest = await connectionRequestModel.findByIdAndUpdate(
        requestId,
        { status: status },
        { new: true } // Return the updated document
    );

    if (!updatedRequest) {
        throw new Error("Failed to update connection request");
    }

    return updatedRequest;
}