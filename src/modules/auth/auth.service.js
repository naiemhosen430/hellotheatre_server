import UserModel from "./auth.model.js";

export const createUserService = async (userinfo) => {
  const result = await UserModel.create(userinfo);
  return result;
};

export const findOneByEmailFromUser = async (email) => {
  const result = await UserModel.findOne({ email });
  return result;
};

export const findOneByIdFromUser = async (ruseridq) => {
  const result = await UserModel.findOne({ _id: ruseridq });
  return result;
};

export const getSingleUserService = async (id, myid) => {
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    return null;
  }

  let checkFriend = false;
  user.friends.map((fid) => {
    if (fid === myid) {
      checkFriend = true;
    }
  });

  if (checkFriend) {
    const result = await UserModel.findOne({ _id: id }).select(
      "fullname profilephoto tittle sendrequests gender friendrequests online_status position friends"
    );
    return result;
  }

  const result = await UserModel.findOne({ _id: id }).select(
    "fullname profilephoto sendrequests friendrequests tittle friends gender position"
  );
  return result;
};

export const updateMeService = async (req) => {
  const result = await UserModel.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  return result;
};

export const sendRequestService = async (id, myid) => {
  const result = await UserModel.updateOne(
    { _id: id },
    {
      $push: {
        friendrequests: myid,
      },
    }
  );
  await UserModel.updateOne(
    { _id: myid },
    {
      $push: {
        sendrequests: id,
      },
    }
  );
  return result;
};

export const cencelRequestService = async (id, myid) => {
  const result = await UserModel.updateOne(
    { _id: id },
    {
      $pull: {
        friendrequests: myid,
      },
    }
  );
  await UserModel.updateOne(
    { _id: myid },
    {
      $pull: {
        sendrequests: id,
      },
    }
  );
  return result;
};

export const confirmRequestService = async (id, myid) => {
  const result = await UserModel.updateOne(
    { _id: id },
    {
      $push: {
        friends: myid,
      },
    }
  );
  await UserModel.updateOne(
    { _id: myid },
    {
      $push: {
        friends: id,
      },
    }
  );

  await UserModel.updateOne(
    { _id: id },
    {
      $pull: {
        sendrequests: myid,
      },
    }
  );
  await UserModel.updateOne(
    { _id: myid },
    {
      $pull: {
        friendrequests: id,
      },
    }
  );
  return result;
};

export const deleteRequestService = async (id, myid) => {
  const result = await UserModel.updateOne(
    { _id: id },
    {
      $pull: {
        sendrequests: myid,
      },
    }
  );
  await UserModel.updateOne(
    { _id: myid },
    {
      $pull: {
        friendrequests: id,
      },
    }
  );
  return result;
};

export const unfriendService = async (id, myid) => {
  const result = await UserModel.updateOne(
    { _id: id },
    {
      $pull: {
        friends: myid,
      },
    }
  );
  await UserModel.updateOne(
    { _id: myid },
    {
      $pull: {
        friends: id,
      },
    }
  );
  await UserModel.updateOne(
    { _id: myid },
    {
      $pull: {
        sendrequests: id,
      },
    }
  );
  return result;
};

export const blockService = async (id, myid) => {
  await UserModel.updateOne(
    { _id: myid },
    {
      $pull: {
        block: id,
      },
    }
  );

  return result;
};
