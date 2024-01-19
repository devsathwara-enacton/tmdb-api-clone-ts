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
const http_status_codes_1 = require("http-status-codes");
const responseUtlis_1 = __importDefault(require("../../utils/responseUtlis"));
const validation_1 = require("../../validation/validation");
const jwt_1 = require("../../utils/jwt");
function insert(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            const decoded = (0, jwt_1.decodeToken)(res, token);
            let { mid, cid } = req.body;
            let { comments } = validation_1.validateComment.parse(req.body);
            if (cid == null) {
                let data = {
                    movie_id: mid,
                    uid: decoded.uid,
                    comment: comments,
                    parent_id: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                };
                const result = yield index_1.comment.insert(data);
                (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
                    message: "The comment was added successfully",
                });
            }
            else {
                let data = {
                    movie_id: mid,
                    uid: decoded.uid,
                    comment: comments,
                    parent_id: cid,
                    created_at: new Date(),
                    updated_at: new Date(),
                };
                const result = yield index_1.comment.insert(data);
                (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, {
                    message: "Reply comment was added successfully",
                });
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insert = insert;
function fetch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mid } = req.params;
        const comments = yield index_1.comment.fetch(mid);
        if (!comments || !Array.isArray(comments)) {
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.NOT_FOUND, {
                message: "No Comments Found",
            });
        }
        else {
            console.log(comments);
            (0, responseUtlis_1.default)(res, http_status_codes_1.StatusCodes.OK, { comments: comments });
        }
    });
}
exports.fetch = fetch;
