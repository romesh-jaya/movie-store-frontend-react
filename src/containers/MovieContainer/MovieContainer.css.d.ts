declare namespace MovieContainerCssNamespace {
  export interface IMovieContainerCss {
    div1: string;
    header: string;
    headerText: string;
    nowrapDiv: string;
  }
}

declare const MovieContainerCssModule: MovieContainerCssNamespace.IMovieContainerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieContainerCssNamespace.IMovieContainerCss;
};

export = MovieContainerCssModule;
