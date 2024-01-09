import express, { NextFunction, Request, Response, Router } from "express";
import { favourite } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
const router: Router = express.Router();

router.post("/insert", authCheck, favourite.insert);
router.post("/delete", authCheck, favourite.remove);
router.get("/access", authCheck, favourite.fetch);
export default router;
