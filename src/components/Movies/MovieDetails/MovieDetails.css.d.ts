declare namespace MovieDetailsCssNamespace {
  export interface IMovieDetailsCss {
    Button: string;
    drawer: string;
    'header-custom': string;
    'header-custom-span': string;
    'movie-absent': string;
    'movie-details': string;
    'movie-present': string;
    'spinner-div': string;
  }
}

declare const MovieDetailsCssModule: MovieDetailsCssNamespace.IMovieDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieDetailsCssNamespace.IMovieDetailsCss;
};

export = MovieDetailsCssModule;
