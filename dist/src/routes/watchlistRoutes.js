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
exports.router.post("/create", authMiddleware_1.authCheck, controllers_1.watchList.create);
exports.router.post("/insert", authMiddleware_1.authCheck, controllers_1.watchList.insert);
exports.router.get("/movies/:id", authMiddleware_1.authCheck, controllers_1.watchList.getMovies);
exports.router.get("/fetch", authMiddleware_1.authCheck, controllers_1.watchList.fetch);
exports.router.put("/update/:id", authMiddleware_1.authCheck, controllers_1.watchList.update);
exports.router.delete("/delete/:id", authMiddleware_1.authCheck, controllers_1.watchList.remove);
exports.router.delete("/delete-movies/:id/:mid", authMiddleware_1.authCheck, controllers_1.watchList.removeMovie);
exports.router.get("/share/:id", controllers_1.watchList.share);
