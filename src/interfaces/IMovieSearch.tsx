import IMovieStub from './IMovieStub';

export default interface IMovieSearch extends IMovieStub {
  actors: string;
  language: string;
  mediaURL: string; 
  plot: string;
}
  