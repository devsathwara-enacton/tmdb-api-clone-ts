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
const kysely_1 = require("kysely");
function insert(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data) {
            console.warn("No data provided for insertion.");
            return;
        }
        const checkLikeDislike = yield database_1.db
            .selectFrom("movie_likes")
            .selectAll()
            .where("mid", "=", data.mid)
            .executeTakeFirst();
        if (checkLikeDislike) {
            const result = yield database_1.db
                .updateTable("movie_likes")
                .set({
                reaction: data.reaction,
                updated_at: new Date(),
            })
                .where("mid", "=", data.mid)
                .executeTakeFirst();
            return result;
        }
        else {
            const result = yield database_1.db.insertInto("movie_likes").values(data).execute();
            return result;
        }
    });
}
exports.insert = insert;
function fetch(mid) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (0, kysely_1.sql) `SELECT
  COUNT(CASE WHEN reaction = 'LIKE' THEN 1 END) AS like_count,
  COUNT(CASE WHEN reaction = 'DISLIKE' THEN 1 END) AS dislike_count
FROM movie_likes WHERE mid=${mid};
`.execute(database_1.db);
        return result;
    });
}
exports.fetch = fetch;
