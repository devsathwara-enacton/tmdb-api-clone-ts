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
exports.chart = exports.User = exports.watchList = exports.favorite = exports.comment = exports.reaction = exports.ratings = exports.movies = void 0;
const movies = __importStar(require("./moviesModel"));
exports.movies = movies;
const ratings = __importStar(require("./ratingsModel"));
exports.ratings = ratings;
const reaction = __importStar(require("./reactionModel"));
exports.reaction = reaction;
const comment = __importStar(require("./commentModel"));
exports.comment = comment;
const favorite = __importStar(require("./favoritesModel"));
exports.favorite = favorite;
const watchList = __importStar(require("./watchListModel"));
exports.watchList = watchList;
const User = __importStar(require("./userModel"));
exports.User = User;
const chart = __importStar(require("./chartModel"));
exports.chart = chart;
