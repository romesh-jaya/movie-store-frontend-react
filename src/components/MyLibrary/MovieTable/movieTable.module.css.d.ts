declare namespace MovieTableModuleCssNamespace {
  export interface IMovieTableModuleCss {
    'link-button': string;
    'pagination-style': string;
    'responsive-content': string;
    'table-style': string;
  }
}

declare const MovieTableModuleCssModule: MovieTableModuleCssNamespace.IMovieTableModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MovieTableModuleCssNamespace.IMovieTableModuleCss;
};

export = MovieTableModuleCssModule;
