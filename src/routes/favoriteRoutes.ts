import express, { NextFunction, Request, Response, Router } from "express";
import { favorite } from "../controllers";
import { authCheck } from "../middleware/authMiddleware";
export const router: Router = express.Router();

router.post("/insert", authCheck, favorite.insert);
router.get("/access", authCheck, favorite.fetch);
router.post("/delete", authCheck, favorite.remove);
