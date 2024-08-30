import express from "express";
import {
  createUserController,
  getMeController,
  loginController,
} from "./auth.controler.js";
import { authentication } from "../../utils/Authentication.js";

const authRouter = express.Router();

authRouter.route("/createroom").post(createUserController);
authRouter.route("/login").post(loginController);
authRouter.route("/me").post(authentication, getMeController);

export default authRouter;
