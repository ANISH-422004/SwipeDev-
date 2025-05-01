const chatModel = require("../models/chat.model");

const initializeSocket = (server) => {
  const socket = require("socket.io");
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ targetuserId, userId }) => {
      const room = [targetuserId, userId].sort().join("_");
      socket.join(room);
    });

    socket.on("message", async ({ message, targetuserId, userId }) => {
        const room = [targetuserId, userId].sort().join("_");
      
        try {
          let chat = await chatModel.findOne({ participants: { $all: [targetuserId, userId] } });
      
          if (!chat) {
            chat = new chatModel({ participants: [targetuserId, userId], messages: [] });
          }
      
          const newMsg = {
            senderId: userId,
            text: message,
            timestamp: new Date(), // Optional: include if your schema supports it
          };
      
          chat.messages.push(newMsg);
          await chat.save();
      
          // Emit the structured message to both users
          io.to(room).emit("message", newMsg); // sends to sender + receiver
        } catch (err) {
          console.error("Chat error:", err);
        }
      });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = initializeSocket;
