declare namespace IndexCssNamespace {
  export interface IIndexCss {
    'error-text': string;
    'margin-b-20': string;
    'margin-r-10': string;
    'margin-r-30': string;
    movies: string;
  }
}

declare const IndexCssModule: IndexCssNamespace.IIndexCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexCssNamespace.IIndexCss;
};

export = IndexCssModule;
