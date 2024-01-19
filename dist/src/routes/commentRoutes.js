"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.router = express_1.default.Router();
exports.router.post("/insert", authMiddleware_1.authCheck, authMiddleware_1.checkVerifyEmail, controllers_1.comment.insert);
exports.router.get("/fetch/:mid", controllers_1.comment.fetch);
