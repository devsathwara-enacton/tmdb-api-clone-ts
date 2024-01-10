import { User } from "../models/index";
import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import config from "../config/config";
import { createJWTToken, validateJWTToken, decodeToken } from "../../utils/jwt";
import { StatusCodes } from "http-status-codes";
import {
  signInValidation,
  passwordValidation,
} from "../../validation/validation";
import sendResponse from "../../utils/responseUtlis";
import { sendEmail } from "../../utils/sendemail";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let { email, password }: any = await signInValidation.parse(req.body);
    let { username } = req.body;
    const userExist = await User.findUser(email);
    if (userExist) {
      sendResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Your account already exist please login",
      });
    }
    // hash the password before saving it to database
    password = await bcrypt.hash(password, 10);
    let token = createJWTToken(
      { email: email, name: username },
      `${parseInt(config.env.app.expiresIn)}h`
    );
    let data: any = {
      username: username,
      email: email,
      password: password,
      is_verified: false,
    };
    const user = await User.register(data);
    if (user) {
      //verify email
      const info = await sendEmail(
        config.env.app.email,
        email,
        "Email Verification Link",
        `Hello👋,${username} 
      Please verify your email by clicking this link`,
        `${config.env.app.appUrl}/user/verify-email/${token}`
      );

      // console.log("Message sent: %s", info.messageId);
      sendResponse(res, StatusCodes.OK, {
        message: `Message Sent to ${email} Please verify it`,
      });
    } else {
      console.log("Error in creating new user");
      throw new Error("Error in creating new user");
    }
  } catch (error) {
    next(error);
  }
};
export const login = async (req: Request, res: Response): Promise<any> => {
  let { email, password } = req.body;
  const user = await User.findUser(email);
  if (!user) {
    sendResponse(res, StatusCodes.NON_AUTHORITATIVE_INFORMATION, {
      auth: false,
      token: null,
      message: "Email not found please register",
    });
  } else {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      sendResponse(res, StatusCodes.NON_AUTHORITATIVE_INFORMATION, {
        auth: false,
        token: null,
        message: "Wrong Password",
      });
    }
    var token = createJWTToken(
      { email: user.email, uid: user.id },
      `${parseInt(config.env.app.expiresIn)}h`
    );
    res.cookie("token", token, {
      httpOnly: true,
      expires: config.env.app.cookieExpiration,
    });
    sendResponse(res, StatusCodes.OK, {
      auth: true,
      username: user.username,
      message: "Authentication Successfull",
    });
  }
};
export const logout = async (req: Request, res: Response): Promise<any> => {
  const token = res.clearCookie("token");
  sendResponse(res, StatusCodes.OK, {
    auth: false,
    token: null,
    email: null,
    message: "Logout Successful",
  });
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token } = req.params;
  const decoded: any = decodeToken(res, token);
  const user = await User.findUser(decoded.email);
  if (user.is_verified == 0) {
    await User.updateIsVerified(decoded.email, null);
    const info = await sendEmail(
      config.env.app.email,
      decoded.email,
      "Welcome🙌🙌",
      `Hello👋, 
          Welcome to TMDB(The Movie Database)`,
      ""
    );
    sendResponse(res, StatusCodes.OK, {
      message: "Your email is successfully verified you can login now",
    });
  } else {
    sendResponse(res, StatusCodes.CONFLICT, {
      message: "Your email is already verified please login",
    });
  }
};
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email } = req.body;
  const user = await User.findUser(email);
  if (!user) {
    sendResponse(res, StatusCodes.NOT_FOUND, { message: "User not found" });
  } else {
    const resetToken = createJWTToken(
      { email: email },
      `${parseInt(config.env.app.expiresIn)}h`
    );
    const resetLink = `${config.env.app.appUrl}/user/reset-password/${resetToken}`;
    const info = await sendEmail(
      config.env.app.email,
      email,
      "Password Reset Link",
      `Hello👋, click the link below to reset your password`,
      `${resetLink}`
    );
    sendResponse(res, StatusCodes.OK, {
      message: "Password reset link sent to your email",
    });
  }
};
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token } = req.params;
    const { password } = await passwordValidation.parse(req.body);

    if (!token) {
      sendResponse(res, StatusCodes.NOT_FOUND, {
        message: "Token NOT FOUND",
      });
    } else {
      const decoded: any = decodeToken(res, token);
      // Continue with your password reset logic
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.updatePassword(decoded.email, hashedPassword);
      sendResponse(res, StatusCodes.OK, {
        message: "Password reset successful",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let email = req.cookies.email;
    const { currentPassword } = req.body;
    const { password }: any = await passwordValidation.parse(req.body);
    const user = await User.findUser(email);
    if (!user) {
      sendResponse(res, StatusCodes.NOT_FOUND, {
        message: "User Not Found",
      });
    } else {
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!validPassword) {
        sendResponse(res, StatusCodes.BAD_REQUEST, {
          message: "Current Password is incorrect",
        });
      } else {
        const hashedNewPassword = await bcrypt.hash(password, 10);
        await User.updatePassword(email, hashedNewPassword);
        sendResponse(res, StatusCodes.ACCEPTED, {
          message: "Password changed successfully",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
