import express from "express";
import { authentication } from "./../../utils/Authentication.js";
import {
  blockControler,
  cencelRequestControler,
  confirmRequestControler,
  deleteRequestControler,
  getSingleUserControler,
  sendRequestControler,
  unfriendControler,
  getAllUserControler,
} from "./user.controler.js";

const userRouter = express.Router();

userRouter.route("/").get(getAllUserControler);

userRouter.route("/:id").get(getSingleUserControler);

userRouter.route("/sendrequest/:id").put(authentication, sendRequestControler);

userRouter
  .route("/cencelrequest/:id")
  .put(authentication, cencelRequestControler);

userRouter
  .route("/confirmrequest/:id")
  .put(authentication, confirmRequestControler);

userRouter
  .route("/deleterequest/:id")
  .put(authentication, deleteRequestControler);

userRouter.route("/unfriend/:id").put(authentication, unfriendControler);

userRouter.route("/block/:id").put(authentication, blockControler);

export default userRouter;
