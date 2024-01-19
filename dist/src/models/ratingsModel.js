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
exports.insert = exports.fetch = void 0;
const database_1 = require("../db/database");
const kysely_1 = require("kysely");
function fetch(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (0, kysely_1.sql) `SELECT
    JSON_UNQUOTE(JSON_EXTRACT(mi.genre_ids, "$[0]")) as genre_id,
    mg.name as genre_name,
    SUM(mi.popularity) as popularity
  FROM \`movies-info\` mi
  JOIN \`movies-genre\` mg ON JSON_UNQUOTE(JSON_EXTRACT(mi.genre_ids, "$[0]")) = mg.id
  WHERE JSON_UNQUOTE(JSON_EXTRACT(mi.genre_ids, "$[0]")) IN (${id})
  GROUP BY genre_id, genre_name;`.execute(database_1.db);
        return result;
    });
}
exports.fetch = fetch;
function insert(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data) {
            console.warn("No data provided for insertion.");
            return;
        }
        try {
            const checkRatings = yield database_1.db
                .selectFrom("movies_ratings")
                .selectAll()
                .where("uid", "=", data.uid)
                .executeTakeFirst();
            if (checkRatings) {
                const result = yield database_1.db
                    .updateTable("movies_ratings")
                    .set({
                    rating: data.rating,
                    updated_at: new Date(),
                })
                    .where("mid", "=", data.mid)
                    .where("types", "=", data.types)
                    .execute();
                return result;
            }
            else {
                const result = yield database_1.db
                    .insertInto("movies_ratings")
                    .values(data)
                    .execute();
                return result;
            }
        }
        catch (error) {
            console.error("SQL Error:", error.message);
            throw error;
        }
    });
}
exports.insert = insert;
