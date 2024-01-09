import express, { NextFunction, Request, Response } from "express";
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
import * as Z from "zod";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError } from "jsonwebtoken";
import sendResponse from "./utils/responseUtlis";
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
  const routePath = req.route ? req.route.path : "unknown";
  if (err instanceof Z.ZodError) {
    const errorMessage = err.errors.map((e: any) => e.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  logger.error(
    JSON.stringify(routePath) + "  " + "Unhandled Error: " + err.stack
  );
  // Log the error to the console
  console.error({ error: err.stack });
  return sendResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    err.message || "Something went wrong on the server"
  );
  // Send a generic error response
});
export default app;
