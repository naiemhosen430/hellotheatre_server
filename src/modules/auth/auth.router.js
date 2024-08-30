import express from "express";
import { createUserController, joinRoomController } from "./auth.controler.js";
import { authentication } from "../../utils/Authentication.js";

const authRouter = express.Router();

authRouter.route("/createroom").post(createUserController);
authRouter.route("/join").post(authentication, joinRoomController);

export default authRouter;
