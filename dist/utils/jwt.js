"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.validateJWTToken = exports.createJWTToken = void 0;
const config_1 = __importDefault(require("../src/config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseUtlis_1 = __importDefault(require("./responseUtlis"));
const http_status_codes_1 = require("http-status-codes");
const secret = config_1.default.env.app.secret;
function createJWTToken(data, expiresIn) {
    if (!secret) {
        throw new Error("JWT Secret is not defined");
    }
    return jsonwebtoken_1.default.sign(data, secret, { expiresIn: expiresIn });
}
exports.createJWTToken = createJWTToken;
function validateJWTToken(token) {
    if (!secret) {
        throw new Error("JWT Secret is not defined");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (err) {
        console.log(err);
    }
}
exports.validateJWTToken = validateJWTToken;
function decodeToken(res, token) {
    const decoded = validateJWTToken(token);
    // Check if the token is expired
    if (decoded.exp <= Date.now() / 1000) {
        return (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            message: "Token has expired",
        });
    }
    return decoded;
}
exports.decodeToken = decodeToken;
