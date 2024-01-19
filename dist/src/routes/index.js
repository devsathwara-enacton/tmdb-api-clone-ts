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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingsRoutes = exports.moviesRoutes = exports.reactionRoutes = exports.watchListRoutes = exports.favoriteRoutes = exports.commentRoutes = exports.chartRoutes = exports.authRoutes = void 0;
const authRoutes = __importStar(require("./authroutes"));
exports.authRoutes = authRoutes;
const chartRoutes = __importStar(require("./chartRoutes"));
exports.chartRoutes = chartRoutes;
const commentRoutes = __importStar(require("./commentRoutes"));
exports.commentRoutes = commentRoutes;
const favoriteRoutes = __importStar(require("./favoriteRoutes"));
exports.favoriteRoutes = favoriteRoutes;
const watchListRoutes = __importStar(require("./watchlistRoutes"));
exports.watchListRoutes = watchListRoutes;
const reactionRoutes = __importStar(require("./reactionRoutes"));
exports.reactionRoutes = reactionRoutes;
const moviesRoutes = __importStar(require("./moviesRoutes"));
exports.moviesRoutes = moviesRoutes;
const ratingsRoutes = __importStar(require("./ratingsRoutes"));
exports.ratingsRoutes = ratingsRoutes;
