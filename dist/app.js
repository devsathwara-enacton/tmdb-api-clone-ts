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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./src/routes/index");
const Z = __importStar(require("zod"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./utils/logger"));
const http_status_codes_1 = require("http-status-codes");
const responseUtlis_1 = __importDefault(require("./utils/responseUtlis"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/movies", index_1.moviesRoutes.router);
app.use("/user", index_1.authRoutes.router);
app.use("/chart", index_1.chartRoutes.router);
app.use("/comment", index_1.commentRoutes.router);
app.use("/reaction", index_1.reactionRoutes.router);
app.use("/ratings", index_1.ratingsRoutes.router);
app.use("/favorite", index_1.favoriteRoutes.router);
app.use("/watchList", index_1.watchListRoutes.router);
app.use((err, req, res, next) => {
    const routePath = req.route ? req.route.path : "unknown";
    if (err instanceof Z.ZodError) {
        const errorMessage = err.errors.map((e) => e.message).join(", ");
        return res.status(400).json({ error: errorMessage });
    }
    logger_1.default.error(JSON.stringify(routePath) + "  " + "Unhandled Error: " + err.stack);
    // Log the error to the console
    console.error({ error: err.stack });
    return (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, err.message || "Something went wrong on the server");
    // Send a generic error response
});
exports.default = app;
