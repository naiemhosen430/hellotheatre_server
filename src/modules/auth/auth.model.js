import { Schema, model } from "mongoose";
import validator from "validator";

const userSchema = new Schema(
  {
    fullname: {
      type: "String",
      required: "true",
      validate: [
        {
          validator: (value) => validator.isLength(value, { min: 3, max: 50 }),
          message: "Name must be between 3 and 50 characters.",
        },
      ],
      default: "",
    },
    username: {
      type: "String",
      required: "true",
      default: "",
    },
    coverphoto: {
      type: "String",
      required: true,
      default: "default.jpeg",
    },
    profilephoto: {
      type: "String",
      required: true,
      default: "default.jpeg",
    },
    tittle: {
      type: "string",
      minLength: 0,
      required: true,
      maxLength: 300,
      default: "not set",
    },
    gender: {
      type: "String",
      required: true,
      enum: ["male", "female", "other", "not set"],
      default: "not set",
    },
    status: {
      type: "String",
      required: true,
      enum: ["active", "blocked"],
      default: "active",
    },
    role: {
      type: "String",
      required: true,
      enum: ["user"],
      default: "user",
    },
    hometwon: {
      type: "string",
      required: true,
      minLength: 0,
      maxLength: 50,
      default: "not set",
    },
    friendrequests: {
      required: true,
      type: "Array",
      default: [],
    },
    sendrequests: {
      required: true,
      type: "Array",
      default: [],
    },
    friends: {
      required: true,
      type: "Array",
      default: [],
    },
    members: {
      required: true,
      type: "Array",
      default: [],
    },
    block: {
      required: true,
      type: "Array",
      default: [],
    },
    homecity: {
      type: "string",
      required: true,
      minLength: 0,
      maxLength: 50,
      default: "not set",
    },
    birthday: {
      type: "string",
      required: true,
      default: "not set",
    },
    online_status: {
      type: "string",
      enum: ["true", "false"],
      required: true,
      default: "false",
    },
    email: {
      type: "String",
      required: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format.",
      },
    },
    password: {
      type: "String",
      required: true,
    },
    verificationCode: {
      type: "Number",
    },
    note: {
      type: "Array",
    },
    position: {
      type: "string",
      required: true,
      minLength: 0,
      maxLength: 50,
      default: "not set",
    },
    relationshipstatus: {
      type: "string",
      required: true,
      minLength: 0,
      maxLength: 50,
      default: "Single",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("room", userSchema);
export default UserModel;
