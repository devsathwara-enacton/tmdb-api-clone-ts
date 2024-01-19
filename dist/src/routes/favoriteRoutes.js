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
exports.router.post("/insert", authMiddleware_1.authCheck, controllers_1.favorite.insert);
exports.router.get("/access", authMiddleware_1.authCheck, controllers_1.favorite.fetch);
exports.router.post("/delete", authMiddleware_1.authCheck, controllers_1.favorite.remove);
