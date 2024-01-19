"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.logout = exports.login = exports.register = void 0;
const index_1 = require("../models/index");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../config/config"));
const jwt_1 = require("../../utils/jwt");
const http_status_codes_1 = require("http-status-codes");
const validation_1 = require("../../validation/validation");
const responseUtlis_1 = __importDefault(require("../../utils/responseUtlis"));
const sendEmail_1 = require("../../utils/sendEmail");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = yield validation_1.signInValidation.parse(req.body);
        let { username } = req.body;
        const userExist = yield index_1.User.findUser(email);
        if (userExist) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                message: "Your account already exist please login",
            });
        }
        // hash the password before saving it to database
        password = yield bcrypt.hash(password, 10);
        let token = (0, jwt_1.createJWTToken)({ email: email, name: username }, `${parseInt(config_1.default.env.app.expiresIn)}h`);
        let data = {
            username: username,
            email: email,
            password: password,
            is_verified: false,
        };
        const user = yield index_1.User.register(data);
        if (user) {
            //verify email
            const info = yield (0, sendEmail_1.sendEmail)(config_1.default.env.app.email, email, "Email Verification Link", `Hello👋,${username} 
      Please verify your email by clicking this link`, `${config_1.default.env.app.appUrl}/user/verify-email/${token}`);
            // console.log("Message sent: %s", info.messageId);
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
                message: `Message Sent to ${email} Please verify it`,
            });
        }
        else {
            console.log("Error in creating new user");
            throw new Error("Error in creating new user");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    const user = yield index_1.User.findUser(email);
    if (!user) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NON_AUTHORITATIVE_INFORMATION, {
            auth: false,
            token: null,
            message: "Email not found please register",
        });
    }
    else {
        const validPassword = yield bcrypt.compare(password, user.password);
        if (!validPassword) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NON_AUTHORITATIVE_INFORMATION, {
                auth: false,
                token: null,
                message: "Wrong Password",
            });
        }
        var token = (0, jwt_1.createJWTToken)({ email: user.email, uid: user.id }, `${parseInt(config_1.default.env.app.expiresIn)}h`);
        res.cookie("token", token, {
            httpOnly: true,
            expires: config_1.default.env.app.cookieExpiration,
        });
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
            auth: true,
            username: user.username,
            message: "Authentication Successfull",
        });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = res.clearCookie("token");
    (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        auth: false,
        token: null,
        email: null,
        message: "Logout Successful",
    });
});
exports.logout = logout;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    const user = yield index_1.User.findUser(decoded.email);
    if (user.is_verified == 0) {
        yield index_1.User.updateIsVerified(decoded.email, null);
        const info = yield (0, sendEmail_1.sendEmail)(config_1.default.env.app.email, decoded.email, "Welcome🙌🙌", `Hello👋, 
          Welcome to TMDB(The Movie Database)`, "");
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
            message: "Your email is successfully verified you can login now",
        });
    }
    else {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.CONFLICT, {
            message: "Your email is already verified please login",
        });
    }
});
exports.verifyEmail = verifyEmail;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield index_1.User.findUser(email);
    if (!user) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, { message: "User not found" });
    }
    else {
        const resetToken = (0, jwt_1.createJWTToken)({ email: email }, `${parseInt(config_1.default.env.app.expiresIn)}h`);
        const resetLink = `${config_1.default.env.app.appUrl}/user/reset-password/${resetToken}`;
        const info = yield (0, sendEmail_1.sendEmail)(config_1.default.env.app.email, email, "Password Reset Link", `Hello👋, click the link below to reset your password`, `${resetLink}`);
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
            message: "Password reset link sent to your email",
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = yield validation_1.passwordValidation.parse(req.body);
        if (!token) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "Token NOT FOUND",
            });
        }
        else {
            const decoded = (0, jwt_1.decodeToken)(res, token);
            // Continue with your password reset logic
            const hashedPassword = yield bcrypt.hash(password, 10);
            yield index_1.User.updatePassword(decoded.email, hashedPassword);
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
                message: "Password reset successful",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = req.cookies.email;
        const { currentPassword } = req.body;
        const { password } = yield validation_1.passwordValidation.parse(req.body);
        const user = yield index_1.User.findUser(email);
        if (!user) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "User Not Found",
            });
        }
        else {
            const validPassword = yield bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                    message: "Current Password is incorrect",
                });
            }
            else {
                const hashedNewPassword = yield bcrypt.hash(password, 10);
                yield index_1.User.updatePassword(email, hashedNewPassword);
                (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.ACCEPTED, {
                    message: "Password changed successfully",
                });
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
