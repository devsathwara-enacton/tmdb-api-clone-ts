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
exports.remove = exports.check = exports.insert = void 0;
const database_1 = require("../db/database");
const kysely_1 = require("kysely");
function insert(uid, mid) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = (0, kysely_1.sql) `
    UPDATE users
    SET favorites = JSON_ARRAY_APPEND(
      COALESCE(favorites, JSON_ARRAY()),
      '$',
      ${mid}
    )
    WHERE id = ${uid}
    AND JSON_SEARCH(COALESCE(favorites, JSON_ARRAY()), 'one', ${mid}) IS NULL
  `.execute(database_1.db);
        return query;
    });
}
exports.insert = insert;
function check(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield database_1.db
            .selectFrom("users")
            .select("favorites")
            .where("id", "=", parseInt(uid))
            .execute();
        return list;
    });
}
exports.check = check;
function remove(mid, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (0, kysely_1.sql) `
    UPDATE users
    SET favorites = CASE
      WHEN JSON_SEARCH(favorites, 'one', ${mid}) IS NOT NULL
      THEN JSON_SET(COALESCE(favorites, '[]'), '$', JSON_REMOVE(favorites, JSON_UNQUOTE(JSON_SEARCH(favorites, 'one', ${mid}))))
      ELSE COALESCE(favourites, '[]')
    END
    WHERE id = ${uid}
      `.execute(database_1.db);
        return result;
    });
}
exports.remove = remove;
