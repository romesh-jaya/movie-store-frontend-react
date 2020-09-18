declare namespace MovieCssNamespace {
  export interface IMovieCss {
    Author: string;
    Movie: string;
  }
}

declare const MovieCssModule: MovieCssNamespace.IMovieCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieCssNamespace.IMovieCss;
};

export = MovieCssModule;
