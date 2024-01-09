import express, { NextFunction, Request, Response, Router } from "express";
import { ratings } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get("/fetch/:id", ratings.fetch);

router.post("/insert/:mid", authCheck, checkVerifyEmail, ratings.insert);
export default router;
