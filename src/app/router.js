import express from "express";
import userRouter from "../modules/user/user.router.js";
import authRouter from "../modules/auth/auth.router.js";
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Movie theatre is runing");

  res.json("Movie theatre server is runing");
});

// user router
router.use("/api/v3/auth", authRouter);
router.use("/api/v3/user", userRouter);

export default router;
