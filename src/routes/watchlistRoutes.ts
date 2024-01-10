import express, { NextFunction, Request, Response, Router } from "express";
import { watchList } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
export const router: Router = express.Router();
router.post("/create", authCheck, watchList.create);
router.post("/insert", authCheck, watchList.insert);
router.get("/movies/:id", authCheck, watchList.getMovies);
router.get("/fetch", authCheck, watchList.fetch);
router.put("/update/:id", authCheck, watchList.update);
router.delete("/delete/:id", authCheck, watchList.remove);
router.delete("/delete-movies/:id/:mid", authCheck, watchList.removeMovie);
router.get("/share/:id", watchList.share);
