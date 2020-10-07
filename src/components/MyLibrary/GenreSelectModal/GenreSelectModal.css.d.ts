declare namespace GenreSelectModalCssNamespace {
  export interface IGenreSelectModalCss {
    'close-button': string;
    'first-button': string;
    'genre-container': string;
    header: string;
    title: string;
  }
}

declare const GenreSelectModalCssModule: GenreSelectModalCssNamespace.IGenreSelectModalCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GenreSelectModalCssNamespace.IGenreSelectModalCss;
};

export = GenreSelectModalCssModule;
