import express, { NextFunction, Request, Response, Router } from "express";
import { movies } from "../controllers";
import { authCheck, checkVerifyEmail } from "../middleware/authMiddleware";
export const router: Router = express.Router();
router.get("/fetch/", movies.display);
router.get("/:mid", movies.fetch);
router.get("/country-revenues", movies.countriesRevenue);
router.get("/revenue", movies.fetchIncome);
// export default router;
