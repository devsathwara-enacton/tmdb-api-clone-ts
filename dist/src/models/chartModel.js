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
exports.GenreChart = exports.MoviesChart = void 0;
const database_1 = require("../db/database");
const kysely_1 = require("kysely");
const MoviesChart = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, kysely_1.sql) `
    SELECT YEAR(release_date) AS ReleaseYear, WEEKOFYEAR(release_date) AS Week, COUNT(*) AS NumberOfMovies FROM \`movies-info\` WHERE release_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 YEAR) AND CURDATE() GROUP BY YEAR(release_date), WEEKOFYEAR(release_date);
    `.execute(database_1.db);
    return result;
});
exports.MoviesChart = MoviesChart;
const GenreChart = (genreId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, kysely_1.sql) `
    SELECT YEAR(mi.release_date) AS ReleaseYear, WEEKOFYEAR(mi.release_date) AS Week, mg.name AS GenreName, COUNT(*) AS NumberOfMovies FROM \`movies-info\` mi JOIN \`movies-genre\` mg ON FIND_IN_SET(mg.id, mi.genre_ids) WHERE mi.release_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 YEAR) AND CURDATE() AND mg.id = ${genreId} GROUP BY YEAR(mi.release_date), WEEKOFYEAR(mi.release_date);
    `.execute(database_1.db);
    return result;
});
exports.GenreChart = GenreChart;
