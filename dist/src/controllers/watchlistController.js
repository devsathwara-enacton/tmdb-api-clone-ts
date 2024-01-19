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
exports.remove = exports.update = exports.share = exports.removeMovie = exports.getMovies = exports.insert = exports.fetch = exports.create = void 0;
const index_1 = require("../models/index");
const responseUtlis_1 = __importDefault(require("../../utils/responseUtlis"));
const http_status_codes_1 = require("http-status-codes");
const validation_1 = require("../../validation/validation");
const jwt_1 = require("../../utils/jwt");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name } = yield validation_1.validateString.parse(req.body);
        // if (!name) {
        //   sendResponse(res, StatusCodes.BAD_REQUEST, {
        //     message: "List name required",
        //   });
        // }
        const token = req.cookies.token;
        const decoded = (0, jwt_1.decodeToken)(res, token);
        const nameList = yield index_1.watchList.access(decoded.uid);
        if (nameList.name === name) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.CONFLICT, {
                message: `This list already exists!`,
            });
        }
        else {
            let data = {
                name: name,
                uid: decoded.uid,
            };
            const result = yield index_1.watchList.insert(data);
            // if (!result) {
            //   return res.status(400).send({ message: "errror while creating list" });
            // }
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
                Message: "Successfully created list.",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.create = create;
const fetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    const userList = yield index_1.watchList.access(decoded.uid);
    if (userList) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, { WatchList: userList });
    }
    else {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, { message: "No List Found" });
    }
});
exports.fetch = fetch;
const insert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    const { mid, id } = req.body;
    const midCheck = yield index_1.movies.checkMid(mid);
    if (!midCheck) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            message: "Movie id is not there in database",
        });
    }
    const result = yield index_1.watchList.insertMovies(decoded.uid, mid, id);
    if (result.numAffectedRows) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
            message: `${mid} added to your WatchList`,
        });
    }
    if (!result.numAffectedRows) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.CONFLICT, {
            message: `${mid} already in your WatchList`,
        });
    }
});
exports.insert = insert;
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    const { id } = req.params;
    const watchId = yield index_1.watchList.getMid(decoded.uid, id);
    if (!watchId) {
        return (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            message: `The list with the given ID does not exist for your account!`,
        });
    }
    if (watchId.mid === null) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            message: "List Doesnt have any Movies Please Add Movies",
        });
    }
    const moviesArr = [];
    let arr = JSON.parse(watchId.mid);
    const moviePromises = arr.map((i) => __awaiter(void 0, void 0, void 0, function* () {
        const movie = yield index_1.movies.getMovie(i);
        return movie;
    }));
    moviesArr.push(...(yield Promise.all(moviePromises)));
    (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, { WatchListMovies: moviesArr });
});
exports.getMovies = getMovies;
const removeMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const decoded = (0, jwt_1.decodeToken)(res, token);
    const { id } = req.params;
    const { mid } = req.params;
    const deleteFav = yield index_1.watchList.removeMovie(mid, decoded.uid, id);
    (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        message: "Deleted from Your Watch list",
    });
});
exports.removeMovie = removeMovie;
const share = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = yield index_1.watchList.share(id);
    if (!data) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            message: "No Watch List Found",
        });
    }
    let movieArr = [];
    let arr = JSON.parse(data.mid);
    if (arr === null) {
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
            message: "No Movies are there is Watch List",
        });
    }
    const moviePromises = arr.map((i) => __awaiter(void 0, void 0, void 0, function* () {
        const movie = yield index_1.movies.getMovie(i);
        return movie;
    }));
    movieArr.push(...(yield Promise.all(moviePromises)));
    (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.ACCEPTED, {
        WatchListName: data.name,
        Owner: data.email,
        WatchListMovies: movieArr,
    });
});
exports.share = share;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.token;
        const decoded = (0, jwt_1.decodeToken)(res, token);
        const { id } = req.params;
        const { name } = req.body;
        const result = yield index_1.watchList.update(decoded.uid, id, name);
        if (!result) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.CONFLICT, {
                message: "Failed to Update the Name",
            });
        }
        else {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.ACCEPTED, {
                message: "Updated Successfully!",
            });
        }
    });
}
exports.update = update;
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.token;
        const decoded = (0, jwt_1.decodeToken)(res, token);
        const { id } = req.params;
        const result = yield index_1.watchList.remove(decoded.uid, id);
        if (result.length > 0 && result[0].numDeletedRows > 0) {
            // Deletion successful
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
                message: "Delete Successfully!",
            });
        }
        else {
            // Deletion failed
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.CONFLICT, {
                message: "Failed to Delete the Item",
            });
        }
    });
}
exports.remove = remove;
