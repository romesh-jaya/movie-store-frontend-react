declare namespace MovieSearchModuleCssNamespace {
  export interface IMovieSearchModuleCss {
    movies: string;
    'search-input': string;
  }
}

declare const MovieSearchModuleCssModule: MovieSearchModuleCssNamespace.IMovieSearchModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieSearchModuleCssNamespace.IMovieSearchModuleCss;
};

export = MovieSearchModuleCssModule;
