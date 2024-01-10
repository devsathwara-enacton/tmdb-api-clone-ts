import express, { NextFunction, Request, Response, Router } from "express";
import { reaction } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
export const router: Router = express.Router();
router.post("/insert", authCheck, checkVerifyEmail, reaction.insert);
router.get("/fetch/:mid", reaction.fetch);
