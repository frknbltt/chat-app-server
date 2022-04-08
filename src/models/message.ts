import mongoose from "mongoose";

const Message = mongoose.model(
    "Message",
    new mongoose.Schema(
        {
            message: {
                text: { type: String, required: true },
            },
            users: Array,
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        },
        {
            timestamps: true,
        }
    ),
    "Message"
);

export default Message;
