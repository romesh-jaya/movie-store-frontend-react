declare namespace MovieSearchCssNamespace {
  export interface IMovieSearchCss {
    'search-input': string;
  }
}

declare const MovieSearchCssModule: MovieSearchCssNamespace.IMovieSearchCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieSearchCssNamespace.IMovieSearchCss;
};

export = MovieSearchCssModule;
