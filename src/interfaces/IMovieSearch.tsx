import IMovieStub from './IMovieStub';

export default interface IMovieSearch extends IMovieStub {
  actors: string;
  languages: string; // Note: this can contain multiple languages, comma separated
  mediaURL: string;
  plot: string;
}
