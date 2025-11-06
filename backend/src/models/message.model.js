import mongoose from "mongoose";

const messsageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
}, {timestamps: true});

export const Message = mongoose.Model('Message', messsageSchema);