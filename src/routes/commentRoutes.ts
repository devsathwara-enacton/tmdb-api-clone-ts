import express, { NextFunction, Request, Response, Router } from "express";
import { comment } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
const router: Router = express.Router();
router.post("/insertComment/:mid", authCheck, checkVerifyEmail, comment.insert);
router.post(
  "/insertReply/:mid/:cid",
  authCheck,
  checkVerifyEmail,
  comment.insertReply
);
router.get("/getComments/:mid", comment.fetch);
export default router;
