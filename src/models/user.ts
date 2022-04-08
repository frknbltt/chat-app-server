import mongoose from "mongoose";

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {
            type: String,
            required: true,
            min: 3,
            max: 15,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 30,
        },
        isProfilIMG: {
            type: Boolean,
            default: false

        }, profilIMG: {
            type: String,
            default: ""
        }, userFriends: {
            type: Object,
            default: []

        }
    }),
    "user"
);

export default User;
