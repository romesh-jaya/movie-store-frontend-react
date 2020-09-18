import { MovieType } from '../enums/MovieType';

export default interface IMovie {
  title: string; 
  year: string; 
  imdbID: string; 
  actors: string;
  id?: string;
  pGRating?: string;
  language?: string;
  genre?: string[];
  mediaURL?: string; 
  plot?: string; 
  type?: MovieType;
}
  