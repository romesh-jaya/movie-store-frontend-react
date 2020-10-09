import IMovieStub from './IMovieStub';

export default interface IMovieLibrary extends IMovieStub {
  id?: string;
  addedOn?: Date;
  count: number;
  languages: string[];
}
  