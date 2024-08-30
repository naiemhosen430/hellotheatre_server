import express from "express";
import userRouter from "../modules/user/user.router.js";
import authRouter from "../modules/auth/auth.router.js";
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Hello theatre is runing");

  res.json("Hello theatre server is runing");
});

// user router
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/user", userRouter);

export default router;
