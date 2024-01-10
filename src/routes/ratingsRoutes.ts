import express, { NextFunction, Request, Response, Router } from "express";
import { ratings } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
export const router: Router = express.Router();
router.post("/insert", authCheck, checkVerifyEmail, ratings.insert);
router.get("/fetch/:id", ratings.fetch);
