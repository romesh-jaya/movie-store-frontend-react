declare namespace IndexCssModule {
  export interface IIndexCss {
    'margin-b-20': string;
    'margin-r-10': string;
    'margin-r-30': string;
    'red-color': string;
  }
}

declare const IndexCssModule: IndexCssModule.IIndexCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexCssModule.IIndexCss;
};

export = IndexCssModule;
