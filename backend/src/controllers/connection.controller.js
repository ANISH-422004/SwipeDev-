const { getConnections } = require("../services/connectionService");

module.exports.getConnectionsController = async (req, res) => {

    try {
        const { _id: userId } = req.user; // Get the logged-in user's ID from the request object

        // Fetch all  connections for the logged-in user
        const connections = await getConnections(userId);

        return res.status(200).json({ message: "Connections fetched successfully", connections });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}