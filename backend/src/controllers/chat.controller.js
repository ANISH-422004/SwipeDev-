const { fetchChat } = require("../services/chatService");
const connectionRequestModel = require("../models/connectionRequest.model");
module.exports.getAllChatsOfUser = async (req, res) => {
    try {
        const { _id : userId } = req.user._id;
        console.log(userId);
        const { targetUserId } = req.params;

        // check if userId and targetUserId are the friends
        if (!userId || !targetUserId) {
            return res.status(400).json({ message: "Invalid user IDs" });
        }

        const isFriend = await connectionRequestModel.findOne({
            $or: [
                { senderId: userId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: userId },
            ],
            status: "accept",
        });

        if (!isFriend) {
            return res.status(403).json({ message: "You are not friends with this user" });
        }

        const chat = await fetchChat(userId, targetUserId);

        res.status(200).json(chat?.messages || []);
    } catch (error) {
        console.error("Error fetching chats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}