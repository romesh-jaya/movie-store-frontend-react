declare namespace MovieDetailsInputCssNamespace {
  export interface IMovieDetailsInputCss {
    'first-button': string;
    'language-container': string;
  }
}

declare const MovieDetailsInputCssModule: MovieDetailsInputCssNamespace.IMovieDetailsInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieDetailsInputCssNamespace.IMovieDetailsInputCss;
};

export = MovieDetailsInputCssModule;
