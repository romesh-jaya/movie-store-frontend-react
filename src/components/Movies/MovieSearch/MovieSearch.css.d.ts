declare namespace MovieSearchCssModule {
  export interface IMovieSearchCss {
    Movies: string;
  }
}

declare const MovieSearchCssModule: MovieSearchCssModule.IMovieSearchCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieSearchCssModule.IMovieSearchCss;
};

export = MovieSearchCssModule;
