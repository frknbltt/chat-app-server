import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/user";
import messageRoutes from "./routes/message";

const app = express();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

app.use((request: Request, response: Response, next: NextFunction) => {
  response.header("Access-Control-Allow-Origin", "*");

  response.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );

  response.setTimeout(3000);

  if (request.method === "OPTIONS") {
    response.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return response.status(200).json({});
  }
  next();
});

app.use("/user", userRoutes);
app.use("/messages", messageRoutes);

app.use((request: Request, response: Response, next: NextFunction) => {
  const error = new Error("NOT FOUND");
  return response.status(404).json({
    message: error.message,
  });
});

dotenv.config();

mongoose
  .connect(String(process.env.CONNECTION_URL))
  .catch((error) => {
    console.log(error);
  });
const socket = require("socket.io");
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin:
      "https://luminous-pudding-d4544b.netlify.app",
    credentials: true,
  },
});
/* @ts-ignore */
global.onlineUsers = new Map();
/* @ts-ignore */
io.on("connection", (socket: any) => {
  /* @ts-ignore */
  global.chatSocket = socket;
  /* @ts-ignore */
  socket.on("add-user", (userId) => {
    /* @ts-ignore */
    onlineUsers.set(userId, socket.id);
  });
  /* @ts-ignore */
  socket.on("send-msg", (data) => {
    /* @ts-ignore */
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});