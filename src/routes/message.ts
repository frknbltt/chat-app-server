import express from "express";
import { addMessage, getMessages } from "../controllers/message";

const router = express.Router();

router.post("/addmessage", addMessage);
router.post("/getmessages", getMessages);


export default router;
