declare namespace MovieCssModule {
  export interface IMovieCss {
    Author: string;
    Movie: string;
  }
}

declare const MovieCssModule: MovieCssModule.IMovieCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieCssModule.IMovieCss;
};

export = MovieCssModule;
