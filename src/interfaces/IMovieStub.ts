import { MovieType } from '../enums/MovieType';

export default interface IMovieStub {
  genre: string[]; 
  imdbID: string; 
  pGRating: string;
  title: string; 
  type: MovieType;
  year: string; 
}
  