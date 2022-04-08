import { Request, Response, NextFunction } from "express";
import {
    addMessageValidation,
    getMessagesValidation,
} from "../utils/validation-helper";
import Message from "../models/message";
import User from "../models/user";

export const getMessages = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { error } = getMessagesValidation(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        const { from, to } = request.body;

        const messages = await Message.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((item) => {
            return {
                fromSelf: item.sender.toString() === from,
                message: item.message.text,
            };
        });
        response.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};

export const addMessage = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { error } = addMessageValidation(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        const { from, to, message } = request.body;

        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        const user = await User.findById(from)
        const friendControl = await User.findOne({
            _id: to, "userFriends.friendId": user._id
        })

        if (!friendControl) {
            await User.findByIdAndUpdate(
                to,
                {
                    $push: { "userFriends": { friendId: user._id, } }

                },
                { new: true }
            );
        }

        if (data) return response.json({ status: true, error: "Message added successfully." });
        else return response.json({ status: false, error: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
};
