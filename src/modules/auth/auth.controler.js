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
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(409).json({
        statusCode: 409,
        message: "Emaila and password are required.",
      });
    }

    const result = await findOneByEmailFromUser(req.body.email);

    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        message: "No room found with this email",
      });
    }

    const checkPassword = await bcryptjs.compare(
      req.body.password,
      result.password
    );

    if (!checkPassword) {
      return res.status(401).json({
        statusCode: 401,
        message: "Password is incorrect",
      });
    }

    const tokenObj = {
      roomid: result?._id,
      username: result?.username,
    };

    const token = await genarateToken(tokenObj);

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: result,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMeController = async (req, res) => {
  if (!req.user?.roomid) {
    return res.status(401).json({
      statusCode: 401,
      message: "Password is incorrect",
    });
  }
  const user = await findOneByIdFromUser(req.user?.roomid);
  res.status(200).json({
    statusCode: 200,
    message: "success",
    data: user,
  });
};
