const chatModel = require("../models/chat.model")



module.exports.fetchChat = async (userId,targetUserId) => {
    const chat = await chatModel.findOne({
        participants: { $all: [userId, targetUserId] },
    })
    return chat
}