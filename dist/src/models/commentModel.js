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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = exports.insert = void 0;
const database_1 = require("../db/database");
function insert(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield database_1.db.insertInto("movie_comments").values(data).execute();
        return result;
    });
}
exports.insert = insert;
function fetch(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        const comments = yield database_1.db
            .selectFrom("movie_comments")
            .selectAll()
            .where("movie_id", "=", movieId)
            .execute();
        const commentsWithReplies = buildCommentTree(comments);
        return commentsWithReplies;
    });
}
exports.fetch = fetch;
function buildCommentTree(comments, parent_id = null) {
    const result = [];
    for (const comment of comments) {
        if (comment.parent_id == parent_id) {
            const replies = buildCommentTree(comments, comment.id);
            if (replies.length > 0) {
                comment.replies = replies;
            }
            result.push(comment);
        }
    }
    return result;
}
