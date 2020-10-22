declare namespace MovieDetailsModuleCssNamespace {
  export interface IMovieDetailsModuleCss {
    Button: string;
    'close-button': string;
    drawer: string;
    'header-custom': string;
    'header-custom-span': string;
    'movie-absent': string;
    'movie-details': string;
    'movie-present': string;
    'spinner-div': string;
  }
}

declare const MovieDetailsModuleCssModule: MovieDetailsModuleCssNamespace.IMovieDetailsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieDetailsModuleCssNamespace.IMovieDetailsModuleCss;
};

export = MovieDetailsModuleCssModule;
