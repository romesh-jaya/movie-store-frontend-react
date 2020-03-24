declare namespace MovieContainerCssModule {
  export interface IMovieContainerCss {
    div1: string;
    header: string;
    headerText: string;
    nowrapDiv: string;
  }
}

declare const MovieContainerCssModule: MovieContainerCssModule.IMovieContainerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieContainerCssModule.IMovieContainerCss;
};

export = MovieContainerCssModule;
