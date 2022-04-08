import express from "express";
import {
  addFriend,
  createUser, getCurrent, getFriends, loginUser, setProfilIMG,
} from "../controllers/user";

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", loginUser);
router.post("/getCurrent", getCurrent);
router.post("/setProfil", setProfilIMG);
router.post("/addFriend", addFriend);
router.post("/getFriends", getFriends);



export default router;
