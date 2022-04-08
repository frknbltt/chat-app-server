import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addFriendValidation, createUserValidation, getFriendsValidation, loginUserValidation, setProfilIMGValidation } from "../utils/validation-helper";


export const createUser = async (request: Request, response: Response, next: any) => {
    try {
        const { error } = createUserValidation(request.body);
        if (error) {
            return response
                .status(400)
                .json({ message: error.details[0].message });
        }
        const { username, email, password } = request.body;
        const usernameControl = await User.findOne({ username });
        if (usernameControl)
            return response.json({ message: "Username already used", status: false });
        const mailControl = await User.findOne({ username });
        if (mailControl)
            return response.json({ message: "Email already used", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);

        const userControl = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        const token = jwt.sign(

            {
                "_id": userControl._id
            }
            ,
            String(process.env.JWT_SECRET),
            { expiresIn: "365d" }
        );
        return response.json({ status: true, token })

    } catch (error) {
        next(error)
    }
};
export const loginUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error } = loginUserValidation(request.body);
        if (error) {
            return response
                .status(400)
                .json({ message: error.details[0].message });
        }
        const { email, password } = request.body;
        const userControl = await User.findOne({ email });
        if (!userControl)
            return response.json({ message: "Incorrect username or password", status: false });
        const passwordControl = await bcrypt.compare(password, userControl?.password)
        if (!passwordControl)
            return response.json({ message: "Incorrect username or password", status: false });
        const token = jwt.sign(

            {
                "_id": userControl._id
            }
            ,
            String(process.env.JWT_SECRET),
            { expiresIn: "365d" }
        );
        return response.json({ status: true, token })

    } catch (error) {
        next(error)
    }
};
export const getCurrent = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error } = getFriendsValidation(request.body);
        if (error) {
            return response
                .status(400)
                .json({ message: error.details[0].message });
        }
        const { userId } = request.body;
        const userControl = await User.findById(userId);
        if (!userControl)
            return response.json({ message: "Incorrect username or password", status: false });

        return response.json({ status: true, userControl })

    } catch (error) {
        next(error)
    }
};
export const setProfilIMG = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error } = setProfilIMGValidation(request.body);
        if (error) {
            return response
                .status(400)
                .json({ message: error.details[0].message });
        }
        const { userId, img } = request.body;
        const token = jwt.sign(

            {
                "profilIMG": img,
            }
            ,
            String(process.env.JWT_SECRET),
            { expiresIn: "365d" }
        );
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isProfilIMG: true,
                profilIMG: token,
            },
            { new: true }
        );
        return response.json({
            isSet: userData.isProfilIMG,
            image: userData.profilIMG,
        });

    } catch (error) {
        next(error)
    }
};
export const addFriend = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error } = addFriendValidation(request.body);
        if (error) {
            return response
                .status(400)
                .json({ message: error.details[0].message });
        }

        const { fromId, toEmail } = request.body;
        const fromUser = await User.findById(fromId);
        const toUser = await User.findOne({ email: toEmail });
        if (!toUser)
            return response.json({ message: "User not found", status: false });

        await User.findByIdAndUpdate(
            fromId,
            {
                $push: { "userFriends": { friendId: toUser._id, } }

            },
            { new: true }
        );

        return response.json({ status: true })
    } catch (error) {
        next(error)
    }
};
export const getFriends = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error } = getFriendsValidation(request.body);
        if (error) {
            return response
                .status(400)
                .json({ message: error.details[0].message });
        }
        const { userId } = request.body;
        const userControl = await User.findOne({ _id: userId });
        if (!userControl)
            return response.json({ message: "User not found", status: false });
        let array = []
        for (let index = 0; index < userControl?.userFriends.length; index++) {
            array.push(await User.findById(userControl?.userFriends[index].friendId));
        }
        console.log(array);

        const addFriend = userControl?.userFriends?.map(async (friend: any) =>
            await User.findById(friend.friendId)

        )

        return response.json({ status: true, array })
    } catch (error) {
        next(error)
    }
};