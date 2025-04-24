const mongoose = require("mongoose");
const config = require("../config/config");


const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["ignored", "intrested", "accept", "reject"],
        default: "pending",
    },
}, { timestamps: true });

connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });



const connectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;