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
exports.updatePassword = exports.updateIsVerified = exports.findUser = exports.register = void 0;
const database_1 = require("../db/database");
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.db.insertInto("users").values(data).execute();
    return user;
});
exports.register = register;
const findUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.db
        .selectFrom("users")
        .selectAll()
        .where("email", "=", `${email}`)
        .executeTakeFirst();
    return user;
});
exports.findUser = findUser;
const updateIsVerified = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const userUpdate = yield database_1.db
        .updateTable("users")
        .set({
        is_verified: 1,
    })
        .where("email", "=", `${email}`)
        .executeTakeFirst();
    return userUpdate;
});
exports.updateIsVerified = updateIsVerified;
const updatePassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userUpdate = yield database_1.db
        .updateTable("users")
        .set({
        password: password,
    })
        .where("email", "=", `${email}`)
        .executeTakeFirst();
    return userUpdate;
});
exports.updatePassword = updatePassword;
