import axios from '../axios';
import IMovieSearch from '../interfaces/IMovieSearch';

export const getMovieDetails = async (
  movieIMDBId: string,
  searchURL: string,
  apiKey: string
): Promise<IMovieSearch> => {
  const res = await axios.get(
    `${searchURL}?apikey=${apiKey}&i=${movieIMDBId}&plot=full`
  );
  const movie = res.data;
  const genres = movie.Genre ? movie.Genre.split(', ') : 'None';
  return {
    title: movie.Title,
    year: movie.Year,
    imdbID: movie.imdbID,
    mediaURL: movie.Poster,
    actors: movie.Actors,
    plot: movie.Plot,
    type: movie.Type,
    pGRating: movie.Rated,
    languages: movie.Language,
    genre: genres,
  };
};
