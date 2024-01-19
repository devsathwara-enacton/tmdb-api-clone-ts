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
exports.getMovie = exports.getIncome = exports.countryRevenue = exports.checkMid = exports.insertGenre = exports.getMovies = exports.insert = void 0;
const database_1 = require("../db/database");
const kysely_1 = require("kysely");
const insert = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.length == 0) {
        console.warn("No data provided for insertion.");
        return;
    }
    for (const record of data) {
        const result = yield (0, kysely_1.sql) `
        INSERT INTO \`movies-info\`(
          mid,
          adult,
          backdrop_path,
          genre_ids,
          original_language,
          original_title,
          overview,
          popularity,
          poster_path,
          release_date,
          title,
          video,
          vote_average,
          vote_count,
          external_ids,
          status,
          revenue,
          runtime,
          budget,
          countries,
          created_at,
          updated_at,
          keywords
      ) 
        VALUES (
          ${record.mid},
          ${record.adult},
          ${record.backdrop_path},
          ${record.genre_ids},
          ${record.original_language},
          ${record.original_title},
          ${record.overview},
          ${record.popularity},
          ${record.poster_path},
          ${record.release_date},
          ${record.title},
          ${record.video},
          ${record.vote_average},
          ${record.vote_count},
          ${record.external_ids},
          ${record.status},
          ${record.revenue},
          ${record.runtime},
          ${record.budget},
          ${record.countries},
          ${record.created_at},
          ${record.updated_at},
          ${record.keywords}
        )
        ON DUPLICATE KEY UPDATE
          mid = VALUES(mid),
          adult = VALUES(adult),
          backdrop_path = VALUES(backdrop_path),
          genre_ids = VALUES(genre_ids),
          original_language = VALUES(original_language),
          original_title = VALUES(original_title),
          overview = VALUES(overview),
          popularity = VALUES(popularity),
          poster_path = VALUES(poster_path),
          release_date = VALUES(release_date),
          title = VALUES(title),
          video = VALUES(video),
          vote_average = VALUES(vote_average),
          vote_count = VALUES(vote_count),
          external_ids = VALUES(external_ids),
          status = VALUES(status),
          revenue = VALUES(revenue),
          runtime = VALUES(runtime),
          budget = VALUES(budget),
          countries = VALUES(countries),
          created_at=VALUES(created_at),
          updated_at = VALUES(updated_at),
          keywords=VALUES(keywords);
      `.execute(database_1.db);
    }
});
exports.insert = insert;
const getMovies = (pageNumber, limit, genres, countries, language, name, adult, sort_popularity, sort_title, sort_voteAverage, fromDate, toDate, runtimeFrom, runtimeTo, voteAverageFrom, voteAverageTo, voteCountFrom, voteCountTo, keywordId) => __awaiter(void 0, void 0, void 0, function* () {
    // let offset: any = pageNumber == 1 ? 0 : (pageNumber - 1) * limit;
    // name = name + "%";
    const movies = (0, kysely_1.sql) `
  SELECT *
  FROM \`movies-info\`
  WHERE 
  (${genres.length > 0
        ? (0, kysely_1.sql) `JSON_CONTAINS(\`genre_ids\`, JSON_ARRAY(${genres}))`
        : (0, kysely_1.sql) `1`})
  AND (${countries.length > 0
        ? (0, kysely_1.sql) `JSON_CONTAINS(\`countries\`, JSON_ARRAY(${countries}))`
        : (0, kysely_1.sql) `1`})
  AND (${language ? (0, kysely_1.sql) `\`original_language\` = ${language}` : (0, kysely_1.sql) `1`})
  AND (${name && typeof name === "string" && name.length > 0
        ? (0, kysely_1.sql) `\`title\` LIKE ${name + "%"}`
        : (0, kysely_1.sql) `1`})
  AND (${adult ? (0, kysely_1.sql) `\`adult\` = ${adult}` : (0, kysely_1.sql) `1`})
  AND (${fromDate ? (0, kysely_1.sql) `\`release_date\` >= ${fromDate}` : (0, kysely_1.sql) `1`})
  AND (${runtimeFrom ? (0, kysely_1.sql) `\`runtime\` >= ${parseInt(runtimeFrom)}` : (0, kysely_1.sql) `1`})
  AND (${runtimeTo ? (0, kysely_1.sql) `\`runtime\` <= ${parseInt(runtimeTo)}` : (0, kysely_1.sql) `1`})
  AND (${voteAverageFrom
        ? (0, kysely_1.sql) `\`vote_average\` >= ${parseFloat(voteAverageFrom)}`
        : (0, kysely_1.sql) `1`})
  AND (${voteAverageTo
        ? (0, kysely_1.sql) `\`vote_average\` <= ${parseFloat(voteAverageTo)}`
        : (0, kysely_1.sql) `1`})
  AND (${voteCountFrom ? (0, kysely_1.sql) `\`vote_count\` >= ${parseInt(voteCountFrom)}` : (0, kysely_1.sql) `1`})
  AND (${voteCountTo ? (0, kysely_1.sql) `\`vote_count\` <= ${parseInt(voteCountTo)}` : (0, kysely_1.sql) `1`})
  AND (${toDate ? (0, kysely_1.sql) `\`release_date\` <= ${toDate}` : (0, kysely_1.sql) `1`})
  AND (${keywordId.length > 0
        ? (0, kysely_1.sql) `${keywordId
            .map((id) => (0, kysely_1.sql) `JSON_SEARCH(\`keywords\`, 'one', ${id}, NULL, '$[*].id') IS NOT NULL`)
            .reduce((prev, curr) => (0, kysely_1.sql) `${prev} OR ${curr}`)}`
        : (0, kysely_1.sql) `1`})
  ORDER BY
  ${sort_popularity === "popu.desc"
        ? (0, kysely_1.sql) `\`popularity\` DESC`
        : sort_popularity === "popu.asc"
            ? (0, kysely_1.sql) `\`popularity\` ASC`
            : sort_title === "title.asc"
                ? (0, kysely_1.sql) `\`title\` ASC`
                : sort_title === "title.desc"
                    ? (0, kysely_1.sql) `\`title\` DESC`
                    : sort_voteAverage === "vote_average.asc"
                        ? (0, kysely_1.sql) `\`vote_average\` ASC`
                        : sort_voteAverage === "vote_average.desc"
                            ? (0, kysely_1.sql) `\`vote_average\` DESC`
                            : (0, kysely_1.sql) `\`id\` ASC` // Default ORDER BY
    }
  LIMIT ${limit != null ? parseInt(limit) : 20}
  OFFSET ${pageNumber == 1
        ? 0
        : (pageNumber - 1) * (limit != null ? parseInt(limit) : 20)};`.execute(database_1.db);
    return movies;
});
exports.getMovies = getMovies;
const insertGenre = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.length == 0) {
        console.warn("No data provided for insertion.");
        return;
    }
    const result = yield database_1.db
        .insertInto("movies-genre")
        .values(data)
        .ignore()
        .execute();
    return result;
});
exports.insertGenre = insertGenre;
function checkMid(movieID) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield database_1.db
            .selectFrom("movies-info")
            .selectAll()
            .where("mid", "=", parseInt(`${movieID}`))
            .executeTakeFirst();
        return list;
    });
}
exports.checkMid = checkMid;
const countryRevenue = (countries) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, kysely_1.sql) `
    SELECT
      JSON_UNQUOTE(JSON_EXTRACT(countries, "$[0]")) as country_name,
      SUM(revenue) as total_revenue
    FROM  \`movies-info\`
    WHERE JSON_UNQUOTE(JSON_EXTRACT(countries, "$[0]")) IN (${countries})
    GROUP BY JSON_UNQUOTE(JSON_EXTRACT(countries, "$[0]"))
  `.execute(database_1.db);
    return result;
});
exports.countryRevenue = countryRevenue;
const getIncome = (mid) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, kysely_1.sql) `  SELECT
  title,
  budget,
  revenue,
  CASE
    WHEN revenue >= budget THEN 'Profit'
    ELSE 'Loss'
  END AS profit_loss,
  ABS(revenue - budget) AS profit_loss_amount
FROM \`movies-info\`
WHERE mid = ${mid}`.execute(database_1.db);
    return result;
});
exports.getIncome = getIncome;
const getMovie = (mid) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield database_1.db
        .selectFrom("movies-info")
        .selectAll()
        .where("mid", "=", parseInt(`${mid}`))
        .executeTakeFirst();
    return list;
});
exports.getMovie = getMovie;
