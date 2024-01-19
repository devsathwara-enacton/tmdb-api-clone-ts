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
exports.fetch = exports.remove = exports.insert = void 0;
const index_1 = require("../models/index");
const responseUtlis_1 = __importDefault(require("../../utils/responseUtlis"));
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../../utils/jwt");
const insert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    const { mid } = req.body;
    const midCheck = yield index_1.movies.checkMid(mid);
    if (!midCheck) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            message: "Movie id is not there in database",
        });
    }
    const result = yield index_1.favorite.insert(decoded.uid, mid);
    if (result.numAffectedRows) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
            message: `${mid} added to your Favorites`,
        });
    }
    else {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.CONFLICT, {
            message: `${mid} already in your Favorites`,
        });
    }
});
exports.insert = insert;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    const { mid } = req.body;
    const result = yield index_1.favorite.remove(mid, decoded.uid);
    (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        message: `${mid} deleted from favorites`,
    });
});
exports.remove = remove;
const fetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    const favId = yield index_1.favorite.check(decoded.uid);
    const moviesArr = [];
    yield Promise.all(favId.map((i) => __awaiter(void 0, void 0, void 0, function* () {
        let arr = JSON.parse(i.favorites);
        const moviePromises = arr.map((i) => __awaiter(void 0, void 0, void 0, function* () {
            const movie = yield index_1.movies.getMovie(i);
            return movie;
        }));
        moviesArr.push(...(yield Promise.all(moviePromises)));
    })));
    (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, { FavoritesMovies: moviesArr });
});
exports.fetch = fetch;
