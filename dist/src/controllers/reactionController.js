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
exports.fetch = exports.insert = void 0;
const index_1 = require("../models/index");
const responseUtlis_1 = __importDefault(require("../../utils/responseUtlis"));
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../../utils/jwt");
function insert(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { type } = req.body;
        const token = req.cookies.token;
        const decoded = (0, jwt_1.decodeToken)(res, token);
        let { mid } = req.body;
        let data = {
            mid: parseInt(mid),
            uid: decoded.uid,
            reaction: type,
            created_at: new Date(),
            updated_at: new Date(),
        };
        const result = yield index_1.reaction.insert(data);
        if (result) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
                message: `${mid} ${type} by ${decoded.uid}`,
            });
        }
    });
}
exports.insert = insert;
function fetch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mid } = req.params;
        const result = yield index_1.reaction.fetch(mid);
        (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, { reactions: result });
    });
}
exports.fetch = fetch;
