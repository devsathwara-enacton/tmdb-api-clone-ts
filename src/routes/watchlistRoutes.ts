import express, { NextFunction, Request, Response, Router } from "express";
import { watchList } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get("/share/:id", watchList.share);
router.put("/update/:id", authCheck, watchList.update);
router.delete("/delete/:id", authCheck, watchList.remove);
router.post("/delete-movies/:id", authCheck, watchList.removeMovie);
router.post("/create", authCheck, watchList.create);
router.post("/insert", authCheck, watchList.insert);

router.get("/movies/:id", authCheck, watchList.getMovies);
router.get("/access", authCheck, watchList.access);
export default router;
