import bcryptjs from "bcryptjs";
import {
  blockService,
  cencelRequestService,
  confirmRequestService,
  deleteRequestService,
  getSingleUserService,
  sendRequestService,
  unfriendService,
  getAllUserService,
} from "./user.service.js";
import UserModel from "../auth/auth.model.js";

export const getAllUserControler = async (req, res) => {
  try {
    const data = await getAllUserService();

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSingleUserControler = async (req, res) => {
  try {
    const id = req.params.id;
    const myid = req.query.myid;
    const data = await getSingleUserService(id, myid);

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendRequestControler = async (req, res) => {
  try {
    if (!req.user.userId && !req.params.id) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    const myself = await UserModel.findOne({ _id: req.user.userId });
    const checkRequestmyself = myself.friendrequests || [];
    const flatCheckRequestmyself = [].concat(...checkRequestmyself);
    let foundonmyself = false;
    flatCheckRequestmyself.forEach((id) => {
      if (id === req.params.id) {
        foundonmyself = true;
      }
    });

    const user = await UserModel.findOne({ _id: req.params.id });
    const checkRequest = user.friendrequests || [];
    const flatCheckRequest = [].concat(...checkRequest);
    let found = false;
    flatCheckRequest.forEach((id) => {
      if (id === req.user.userId) {
        found = true;
      }
    });

    if (foundonmyself) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }
    if (found) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    const data = await sendRequestService(req.params.id, req.user.userId);

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const cencelRequestControler = async (req, res) => {
  try {
    if (!req.user.userId && !req.params.id) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    const data = await cencelRequestService(req.params.id, req.user.userId);

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const confirmRequestControler = async (req, res) => {
  try {
    if (!req.user.userId && !req.params.id) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    const data = await confirmRequestService(req.params.id, req.user.userId);

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteRequestControler = async (req, res) => {
  try {
    if (!req.user.userId && !req.params.id) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    const data = await deleteRequestService(req.params.id, req.user.userId);

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const unfriendControler = async (req, res) => {
  try {
    if (!req.user.userId && !req.params.id) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    const data = await unfriendService(req.params.id, req.user.userId);

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const blockControler = async (req, res) => {
  try {
    if (!req.user.userId && !req.params.id) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    const data = await blockService(req.params.id, req.user.userId);

    if (!data) {
      return res.status(498).json({
        statusCode: 498,
        message: "Something went wrong",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};
