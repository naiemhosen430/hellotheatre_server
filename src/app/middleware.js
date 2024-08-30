import express from "express";
import cors from "cors";
import { cookiSecretKey, frontEndUrl } from "../../secret.js";

const middleware = [
  express.json(),
  express.urlencoded({ extended: true }),
  cors({
    origin: frontEndUrl,
    credentials: true,
  }),
];

export default middleware;
