declare namespace MovieDetailsInputCssNamespace {
  export interface IMovieDetailsInputCss {
    Button: string;
    drawer: string;
    'first-button': string;
    'header-custom': string;
    'header-custom-span': string;
    'language-container': string;
    'movie-absent': string;
    'movie-details': string;
    'movie-present': string;
    'spinner-div': string;
  }
}

declare const MovieDetailsInputCssModule: MovieDetailsInputCssNamespace.IMovieDetailsInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieDetailsInputCssNamespace.IMovieDetailsInputCss;
};

export = MovieDetailsInputCssModule;
