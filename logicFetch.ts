import axios, { AxiosResponse } from "axios";
import { insert, insertGenre } from "./src/models/moviesModel";
import config from "./src/config/config";
const TMDB_API_KEY = config.env.app.tmdbApiKey;
const ApiUrl = config.env.app.ApiUrl;
let result: any[] = [];
export async function getDetails(movieId: number): Promise<any> {
  try {
    const response: AxiosResponse = await axios.get(
      `${ApiUrl}/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=keywords,external_ids`
    );
    let countryArray = response.data.production_countries;
    let countriesArray = countryArray.map((country: any) => {
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
  } catch (error: any) {
    console.error(
      `Error fetching details for movie ${movieId}:`,
      error.message
    );
    return null;
  }
}
async function getMovies(): Promise<void> {
  try {
    let currentPage = 1;

    while (true) {
      try {
        const response: AxiosResponse = await axios.get(
          `${ApiUrl}/3/discover/movie?page=${currentPage}&api_key=${TMDB_API_KEY}`
        );

        const pageMovies: any = response.data.results;
        if (pageMovies.length === 0) {
          break;
        }

        const promiseMovie = pageMovies.map(async (movie: any) => {
          const details = await getDetails(movie.id);
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
            external_ids: JSON.stringify(details?.external_ids),
            status: details?.status,
            revenue: details?.revenue,
            runtime: details?.runtime,
            budget: details?.budget,
            countries: details?.countries,
            created_at: new Date(),
            updated_at: new Date(),
            keywords: JSON.stringify(details?.keywords),
          });
        });
        await Promise.allSettled(promiseMovie);
        await insert(result); // Call createMovies function here
        result = [];
        console.log("Total Records:", currentPage * 20);
        currentPage++;
      } catch (sqlError: any) {
        console.error("SQL Error:", sqlError.message);
        console.error("SQL Error Code:", sqlError.code);
        console.error("SQL Error Number:", sqlError.errno);
        console.error("SQL State:", sqlError.sqlState);
        // console.error("SQL Query:", sqlError.sql);
      }
    }
  } catch (error: any) {
    console.error("An unexpected error occurred: ", error.message);
  }
}
async function getGenres(): Promise<void> {
  try {
    const response: AxiosResponse = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${TMDB_API_KEY}`
    );
    const genres = response.data.genres;
    const insertData = await insertGenre(genres);
  } catch (error: any) {
    console.error(error);
  }
}
getMovies();
getGenres();
