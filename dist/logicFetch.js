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
exports.getDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const moviesModel_1 = require("./src/models/moviesModel");
const config_1 = __importDefault(require("./src/config/config"));
const TMDB_API_KEY = config_1.default.env.app.tmdbApiKey;
const ApiUrl = config_1.default.env.app.ApiUrl;
let result = [];
function getDetails(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${ApiUrl}/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=keywords,external_ids`);
            let countryArray = response.data.production_countries;
            let countriesArray = countryArray.map((country) => {
                return country.iso_3166_1;
            });
            return {
                // id: response.data.id,
                genres: response.data.genres,
                external_ids: response.data.external_ids,
                status: response.data.status,
                revenue: response.data.revenue,
                runtime: response.data.runtime,
                popularity: response.data.popularity,
                budget: response.data.budget,
                countries: JSON.stringify(countriesArray),
                keywords: response.data.keywords.keywords,
            };
        }
        catch (error) {
            console.error(`Error fetching details for movie ${movieId}:`, error.message);
            return null;
        }
    });
}
exports.getDetails = getDetails;
function getMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let currentPage = 1;
            while (true) {
                try {
                    const response = yield axios_1.default.get(`${ApiUrl}/3/discover/movie?page=${currentPage}&api_key=${TMDB_API_KEY}`);
                    const pageMovies = response.data.results;
                    if (pageMovies.length === 0) {
                        break;
                    }
                    const promiseMovie = pageMovies.map((movie) => __awaiter(this, void 0, void 0, function* () {
                        const details = yield getDetails(movie.id);
                        // console.log(details?.countries);
                        result.push({
                            mid: movie.id,
                            adult: movie.adult,
                            backdrop_path: movie.backdrop_path,
                            genre_ids: JSON.stringify(movie.genre_ids),
                            original_language: movie.original_language,
                            original_title: movie.original_title,
                            overview: movie.overview,
                            popularity: movie.popularity,
                            poster_path: movie.poster_path,
                            release_date: movie.release_date,
                            title: movie.title,
                            video: movie.video,
                            vote_average: movie.vote_average,
                            vote_count: movie.vote_count,
                            external_ids: JSON.stringify(details === null || details === void 0 ? void 0 : details.external_ids),
                            status: details === null || details === void 0 ? void 0 : details.status,
                            revenue: details === null || details === void 0 ? void 0 : details.revenue,
                            runtime: details === null || details === void 0 ? void 0 : details.runtime,
                            budget: details === null || details === void 0 ? void 0 : details.budget,
                            countries: details === null || details === void 0 ? void 0 : details.countries,
                            created_at: new Date(),
                            updated_at: new Date(),
                            keywords: JSON.stringify(details === null || details === void 0 ? void 0 : details.keywords),
                        });
                    }));
                    yield Promise.allSettled(promiseMovie);
                    yield (0, moviesModel_1.insert)(result); // Call createMovies function here
                    result = [];
                    console.log("Total Records:", currentPage * 20);
                    currentPage++;
                }
                catch (sqlError) {
                    console.error("SQL Error:", sqlError.message);
                    console.error("SQL Error Code:", sqlError.code);
                    console.error("SQL Error Number:", sqlError.errno);
                    console.error("SQL State:", sqlError.sqlState);
                    // console.error("SQL Query:", sqlError.sql);
                }
            }
        }
        catch (error) {
            console.error("An unexpected error occurred: ", error.message);
        }
    });
}
function getGenres() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${TMDB_API_KEY}`);
            const genres = response.data.genres;
            const insertData = yield (0, moviesModel_1.insertGenre)(genres);
        }
        catch (error) {
            console.error(error);
        }
    });
}
getMovies();
getGenres();
