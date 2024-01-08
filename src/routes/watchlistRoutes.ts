import express, { NextFunction, Request, Response, Router } from "express";
import { watchList } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get("/share/:id", watchList.shareWatchList);
router.put("/updateWatchListName/:id", authCheck, watchList.update);
router.delete("/deleteWatchList/:id", authCheck, watchList.deleteWatchList);
router.post("/delete-movies-watchList/:id", authCheck, watchList.deleteMovies);
router.post("/create-watch-list", authCheck, watchList.create);
router.post("/insert-watch-list", authCheck, watchList.insert);

router.get("/movies-watch-list/:id", authCheck, watchList.getMovies);
router.get("/access-watch-list", authCheck, watchList.accessList);
export default router;
