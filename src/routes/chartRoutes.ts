import express, { NextFunction, Request, Response, Router } from "express";
import { chart } from "../controllers";
export const router: Router = express.Router();

router.get("/chart-movies", chart.MoviesChart);
router.get("/genre-chart", chart.MoviesChart);
