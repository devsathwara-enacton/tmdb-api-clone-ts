import express, { NextFunction, Request, Response } from "express";
import { config } from "./src/config/config";
import * as Z from "zod";
import {
  moviesRoutes,
  authRoutes,
  chartRoutes,
  commentRoutes,
  ratingsRoutes,
  reactionRoutes,
  favourtieRoutes,
  watchListRoutes,
} from "./src/routes/index";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError } from "jsonwebtoken";
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/movies", moviesRoutes.default);
app.use("/user", authRoutes.default);
app.use("/chart", chartRoutes.default);
app.use("/comment", commentRoutes.default);
app.use("/reaction", reactionRoutes.default);
app.use("/ratings", ratingsRoutes.default);
app.use("/favourite", favourtieRoutes.default);
app.use("/watchList", watchListRoutes.default);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(
    JSON.stringify(req.route.path) + "  " + "Unhandled Error: " + err.stack
  );
  // Log the error to the console
  console.error({ error: err.stack });

  // Send a generic error response
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
});
export default app;
