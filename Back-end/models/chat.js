import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        unique: true,
    },
    dieta: {
        type: String,
        required: true,
    },
    ultimaRequisicao: {
        type: Date,
        required: true,
    },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;