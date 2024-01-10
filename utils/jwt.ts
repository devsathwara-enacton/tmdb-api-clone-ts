import config from "../src/config/config";
import jwt from "jsonwebtoken";
import sendResponse from "./responseUtlis";
import { StatusCodes } from "http-status-codes";

const secret = config.env.app.secret;

export function createJWTToken(data: any, expiresIn: any) {
  if (!secret) {
    throw new Error("JWT Secret is not defined");
  }

  return jwt.sign(data, secret, { expiresIn: expiresIn });
}

export function validateJWTToken(token: any) {
  if (!secret) {
    throw new Error("JWT Secret is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.log(err);
  }
}

export function decodeToken(res: any, token: any) {
  const decoded: any = validateJWTToken(token);

  // Check if the token is expired
  if (decoded.exp <= Date.now() / 1000) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      message: "Token has expired",
    });
  }
  return decoded;
}
