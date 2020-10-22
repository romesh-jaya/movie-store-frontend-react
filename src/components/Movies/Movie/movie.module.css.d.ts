declare namespace MovieModuleCssNamespace {
  export interface IMovieModuleCss {
    author: string;
    movie: string;
  }
}

declare const MovieModuleCssModule: MovieModuleCssNamespace.IMovieModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieModuleCssNamespace.IMovieModuleCss;
};

export = MovieModuleCssModule;
