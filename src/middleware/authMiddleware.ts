import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUser } from "../models/userModel";
import { decodeToken, validateJWTToken } from "../../utils/jwt";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";
export const authCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies.token;
  if (!token) {
    sendResponse(res, StatusCodes.UNAUTHORIZED, {
      message: "Please login first",
    });
  } else {
    next();
  }
};
export const checkVerifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.cookies.token;

  const decoded = decodeToken(res, token);
  if (decoded.uid) {
    const user = await findUser(decoded.email);
    if (user.is_verified == 1) {
      next();
    } else {
      return res.json({
        message:
          "Please verify your account verification link has been sent to your email",
      });
    }
  }
};
