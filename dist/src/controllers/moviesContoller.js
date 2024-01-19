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
exports.fetch = exports.fetchIncome = exports.countriesRevenue = exports.display = void 0;
const Movies = __importStar(require("../models/moviesModel"));
const responseUtlis_1 = __importDefault(require("../../utils/responseUtlis"));
const http_status_codes_1 = require("http-status-codes");
const display = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page;
    const limit = req.query.limit;
    const { genre, countries, languages, name, adult, sort_title, sort_popularity, sort_vote_Average, fromDate, toDate, runtimeFrom, runtimeTo, voteAverageFrom, voteAverageTo, voteCountFrom, voteCountTo, keywordsID, } = req.query || {};
    let keywordArray;
    keywordArray = JSON.parse(keywordsID || "[]");
    let genreArray;
    genreArray = JSON.parse(genre || "[]");
    let countriesArray;
    countriesArray = JSON.parse(countries || "[]");
    if (!page || isNaN(page)) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            error: "Invalid page number!",
        });
    }
    const moviesData = yield Movies.getMovies(page, limit, genreArray || null, countriesArray || null, languages || null, name || null, adult || null, sort_popularity || null, sort_title || null, sort_vote_Average || null, fromDate || null, toDate || null, runtimeFrom || null, runtimeTo || null, voteAverageFrom || null, voteAverageTo || null, voteCountFrom || null, voteCountTo || null, keywordArray || null);
    if (moviesData) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
            page: page,
            Movies: moviesData,
        });
    }
});
exports.display = display;
const countriesRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { countries } = req.body;
    let countriesRevenue = [];
    yield Promise.all(countries.map((country) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield Movies.countryRevenue(country);
        result.rows.forEach((row) => {
            countriesRevenue.push({ [row.country_name]: row.total_revenue });
        });
    })));
    // console.log(countriesRevenue);
    (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        countriesRevenue: countriesRevenue,
    });
});
exports.countriesRevenue = countriesRevenue;
const fetchIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mid } = req.body;
    const midCheck = yield Movies.checkMid(parseInt(mid));
    // (3).toFixed;
    if (!midCheck) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            message: "Movie id is not there in database",
        });
    }
    if (mid) {
        const income = yield Movies.getIncome(mid);
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, { income: income });
    }
    else {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            message: "Movie id required",
        });
    }
});
exports.fetchIncome = fetchIncome;
function fetch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { mid } = req.params;
        const result = yield Movies.getMovie(mid);
        if (!result) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: `No movie found with the given ID : ${mid}`,
            });
        }
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
            Movie: result,
        });
    });
}
exports.fetch = fetch;
