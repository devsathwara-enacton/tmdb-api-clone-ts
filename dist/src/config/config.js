"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    env: {
        app: {
            port: process.env.PORT || "3000",
            secret: process.env.SECRET || "defaultSecret",
            expiresIn: process.env.EXPIREIN || "1d",
            email: process.env.EMAIL || "example@example.com",
            // cookieExpiration: new Date(Date.now() + 24 * 60 * 60 * 1000),
            cookieExpiration: new Date(Date.now() + 60 * 1000), // One minute expiration
            database: process.env.DATABASE || "",
            host: process.env.HOST || "localhost",
            user: process.env.USER || "root",
            sqlPort: process.env.SQLPORT || 3306,
            emailHost: process.env.EMAILHOST,
            emailUser: process.env.EMAILUSER || "",
            emailPass: process.env.EMAILPASS || "",
            appUrl: process.env.APP_URL || "",
            tmdbApiKey: process.env.TMDB_API_KEY || "",
            ApiUrl: process.env.API_URL,
            mailPort: Number(process.env.MAIL_PORT),
        },
    },
};
exports.default = exports.config;
