const connectionRequestModel = require("../models/connectionRequest.model");


// Fetch all pending connections for the logged-in user
module.exports.getPendingConnections = async (userId) => {
    try {
        // Assuming you have a Connection model to interact with your database
        const connections = await connectionRequestModel.find({ receiverId: userId, status: "intrested" }).populate('senderId', "firstName lastName email about age gender profilePic"); // Populate with user details

        return connections;
    } catch (error) {
        console.error("Error fetching connections:", error);
        throw new Error("Error fetching connections");
    }
}


module.exports.getConnections = async (userId) => {

    //a->b or b->a

    const connections = await connectionRequestModel.find({ 
        $or: [
            { senderId: userId, status: "accept" }, 
            { receiverId: userId, status: "accept" }
        ] , 
        $and: [
            { status: "accept" } // Ensure status is "accept"
        ]
    })
    .populate('senderId', "_id firstName lastName email about age gender profilePic")
    .populate('receiverId', "_id firstName lastName email about age gender profilePic");


        
    return connections;


}