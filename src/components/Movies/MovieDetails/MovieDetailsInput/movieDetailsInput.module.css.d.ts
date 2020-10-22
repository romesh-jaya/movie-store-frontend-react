declare namespace MovieDetailsInputModuleCssNamespace {
  export interface IMovieDetailsInputModuleCss {
    'first-button': string;
    'language-container': string;
  }
}

declare const MovieDetailsInputModuleCssModule: MovieDetailsInputModuleCssNamespace.IMovieDetailsInputModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieDetailsInputModuleCssNamespace.IMovieDetailsInputModuleCss;
};

export = MovieDetailsInputModuleCssModule;
