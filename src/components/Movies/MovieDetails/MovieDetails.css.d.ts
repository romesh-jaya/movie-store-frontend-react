declare namespace MovieDetailsCssModule {
  export interface IMovieDetailsCss {
    Button: string;
    MovieDetails: string;
    'header-custom': string;
    'header-custom-span': string;
  }
}

declare const MovieDetailsCssModule: MovieDetailsCssModule.IMovieDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieDetailsCssModule.IMovieDetailsCss;
};

export = MovieDetailsCssModule;
