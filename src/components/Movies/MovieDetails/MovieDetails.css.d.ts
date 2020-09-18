declare namespace MovieDetailsCssNamespace {
  export interface IMovieDetailsCss {
    Button: string;
    MovieDetails: string;
    'header-custom': string;
    'header-custom-span': string;
  }
}

declare const MovieDetailsCssModule: MovieDetailsCssNamespace.IMovieDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieDetailsCssNamespace.IMovieDetailsCss;
};

export = MovieDetailsCssModule;
