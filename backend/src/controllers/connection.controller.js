const { set } = require("../app");
const connectionRequestModel = require("../models/connectionRequest.model");
const userModel = require("../models/user.model");
const { getPendingConnections, getConnections } = require("../services/connectionService");
const { getSuggestedUsersForFeed } = require("../services/userService");


//get all  the pending connections of the logged in user
module.exports.getPendingConnectionsController = async (req, res) => {

    try {
        const { _id: userId } = req.user; // Get the logged-in user's ID from the request object

        // Fetch all  connections for the logged-in user
        const connections = await getPendingConnections(userId);

        return res.status(200).json({ message: "Connections fetched successfully", connections });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


//get all the connections of the logged in user

module.exports.getAllConnectionController = async (req, res) => {
    try {
        const { _id: userId } = req.user; // Get the logged-in user's ID from the request object

        // Fetch all  connections for the logged-in user
        const connections = await getConnections(userId);

        //send the arrya of connections to the client
        let data = connections.map(item => {
            if (item.senderId._id.toString() === userId.toString()) { // if the logged in user is the sender then the reciver is the other user
                return item.receiverId
            }
            return item.senderId
        })

        return res.status(200).json({ message: "Connections fetched successfully", connections: data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports.getUserFeedController = async (req, res) => {
    try {
        const loggedInUser = req.user;

        const users = await getSuggestedUsersForFeed(loggedInUser._id);

        return res.status(200).json({
            message: 'User feed fetched successfully',
            users
        });

    } catch (error) {
        console.error('Error in getUserFeedController:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

