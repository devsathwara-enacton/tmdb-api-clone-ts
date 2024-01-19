"use strict";
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
exports.checkVerifyEmail = exports.authCheck = void 0;
const userModel_1 = require("../models/userModel");
const jwt_1 = require("../../utils/jwt");
const responseUtlis_1 = __importDefault(require("../../utils/responseUtlis"));
const http_status_codes_1 = require("http-status-codes");
const authCheck = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, {
            message: "Please login first",
        });
    }
    else {
        next();
    }
};
exports.authCheck = authCheck;
const checkVerifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    if (decoded.uid) {
        const user = yield (0, userModel_1.findUser)(decoded.email);
        if (user.is_verified == 1) {
            next();
        }
        else {
            return res.json({
                message: "Please verify your account verification link has been sent to your email",
            });
        }
    }
});
exports.checkVerifyEmail = checkVerifyEmail;
