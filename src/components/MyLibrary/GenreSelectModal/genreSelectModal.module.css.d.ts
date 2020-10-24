declare namespace GenreSelectModalModuleCssNamespace {
  export interface IGenreSelectModalModuleCss {
    'close-button': string;
    'first-button': string;
    'genre-container-2': string;
    'genre-container-3': string;
    header: string;
    title: string;
  }
}

declare const GenreSelectModalModuleCssModule: GenreSelectModalModuleCssNamespace.IGenreSelectModalModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GenreSelectModalModuleCssNamespace.IGenreSelectModalModuleCss;
};

export = GenreSelectModalModuleCssModule;
