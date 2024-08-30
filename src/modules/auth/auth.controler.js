import bcryptjs from "bcryptjs";
import crypto from "crypto";
import UserModel from "./auth.model.js";
import {
  createUserService,
  findOneByIdFromUser,
  findOneByEmailFromUser,
  updateMeService,
} from "./auth.service.js";
import { genarateToken } from "../../utils/genarateToken.js";

export const createUserController = async (req, res) => {
  try {
    if (!req.body.fullname || !req.body.email || !req.body.password) {
      return res.status(409).json({
        statusCode: 409,
        message: "Room name is required!.",
      });
    }

    const checkUser = await UserModel.findOne({ email: req.body.email });
    if (checkUser) {
      return res.status(409).json({
        statusCode: 409,
        message: "This email is already in use",
      });
    }

    const hashPassword = bcryptjs.hashSync(req.body.password, 10);
    let username = req.body.fullname;
    username = username.toLowerCase();
    username = username.replace(/[^a-z0-9 ]/g, "");
    username = username.replace(/\s+/g, "_");
    const randomString = crypto.randomBytes(2).toString("hex");
    username = `${username}${randomString}`;

    const userinfo = {
      fullname: req.body.fullname,
      password: hashPassword,
      username: username,
      email: req.body.email,
    };

    const result = await createUserService(userinfo);

    if (!result) {
      return res.status(500).json({
        statusCode: 500,
        message: "Fieled to create rooom",
      });
    }

    const tokenObj = {
      roomid: result._id,
      username: username,
    };

    const token = await genarateToken(tokenObj);

    if (!token) {
      return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Room created successfully",
      data: result,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: error,
    });
  }
};

export const joinRoomController = async (req, res) => {
  try {
    if (!req.body && !req.params.id) {
      return res.status(498).json({
        statusCode: 498,
        message: "Email and password is required!",
      });
    }

    const data = await updateMeService(req);

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "No room with this account!",
      });
    }

    const tokenObj = {
      roomid: data?._id,
      username: data?.username,
    };

    const token = await genarateToken(tokenObj);

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};
