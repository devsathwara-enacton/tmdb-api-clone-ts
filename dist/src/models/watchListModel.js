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
exports.getMid = exports.checkWatchList = exports.access = exports.insert = exports.share = exports.remove = exports.removeMovie = exports.update = exports.insertMovies = void 0;
const database_1 = require("../db/database");
const kysely_1 = require("kysely");
function insertMovies(uid, mid, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (0, kysely_1.sql) `
  UPDATE \`watch-list\`
SET mid = JSON_ARRAY_APPEND(
    COALESCE(mid, JSON_ARRAY()),
    '$',
    ${mid}
)
WHERE uid = ${uid} AND id = ${id}
  AND JSON_SEARCH(COALESCE(mid, JSON_ARRAY()), 'one', ${mid}) IS NULL;
    `.execute(database_1.db);
        return result;
    });
}
exports.insertMovies = insertMovies;
function update(uid, id, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (0, kysely_1.sql) `
      UPDATE \`watch-list\`
      SET name = ${name},updated_at=CURRENT_TIMESTAMP
      WHERE id = ${id} AND uid = ${uid}
    `.execute(database_1.db);
        return result;
    });
}
exports.update = update;
function removeMovie(mid, uid, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (0, kysely_1.sql) `  UPDATE \`watch-list\`
    SET mid = CASE
      WHEN JSON_SEARCH(mid, 'one', ${mid}) IS NOT NULL
      THEN JSON_SET(COALESCE(mid, '[]'), '$', JSON_REMOVE(mid, JSON_UNQUOTE(JSON_SEARCH(mid, 'one', ${mid}))))
      ELSE COALESCE(mid, '[]')
    END
    WHERE uid = ${uid} AND id=${id}`.execute(database_1.db);
        return result;
    });
}
exports.removeMovie = removeMovie;
function remove(uid, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = database_1.db
            .deleteFrom("watch-list")
            .where("id", "=", id)
            .where("uid", "=", parseInt(`${uid}`))
            .execute();
        return result;
    });
}
exports.remove = remove;
function share(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield database_1.db
            .selectFrom("watch-list")
            .selectAll()
            .where("id", "=", parseInt(id))
            .executeTakeFirst();
        if (result) {
            const query = (0, kysely_1.sql) `  UPDATE \`watch-list\`
      SET is_shared=1,updated_at=CURRENT_TIMESTAMP
      WHERE id=${id}`.execute(database_1.db);
            return result;
        }
    });
}
exports.share = share;
const insert = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.length == 0) {
        console.warn("No data provided for insertion.");
        return;
    }
    const result = yield database_1.db
        .insertInto("watch-list")
        .values(data)
        .ignore()
        .execute();
});
exports.insert = insert;
const access = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield database_1.db
        .selectFrom("watch-list")
        .selectAll()
        .where("uid", "=", parseInt(`${uid}`))
        .executeTakeFirst();
    return list;
});
exports.access = access;
function checkWatchList(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield database_1.db
            .selectFrom("watch-list")
            .select("mid")
            .where("uid", "=", parseInt(`${uid}`))
            .execute();
        return list;
    });
}
exports.checkWatchList = checkWatchList;
function getMid(uid, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield database_1.db
            .selectFrom("watch-list")
            .select("mid")
            .where("uid", "=", parseInt(`${uid}`))
            .where("id", "=", parseInt(`${id}`))
            .executeTakeFirst();
        return list;
    });
}
exports.getMid = getMid;
