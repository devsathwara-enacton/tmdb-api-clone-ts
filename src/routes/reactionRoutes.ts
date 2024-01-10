import express, { NextFunction, Request, Response, Router } from "express";
import { reaction } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get("/fetch/:mid", reaction.fetch);
router.post("/insert/:mid", authCheck, checkVerifyEmail, reaction.insert);
export default router;
