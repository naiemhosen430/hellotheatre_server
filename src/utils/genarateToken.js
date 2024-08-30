import jwt from "jsonwebtoken";
import { jwtTokenSercretKey } from "../../secret.js";

export const genarateToken = async (tokenObject) => {
  const token = jwt.sign(tokenObject, jwtTokenSercretKey, {
    expiresIn: "10000h",
  });
  return token;
};
