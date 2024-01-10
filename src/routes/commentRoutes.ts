import express, { NextFunction, Request, Response, Router } from "express";
import { comment } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
export const router: Router = express.Router();
router.post("/insert", authCheck, checkVerifyEmail, comment.insert);
router.get("/fetch/:mid", comment.fetch);
