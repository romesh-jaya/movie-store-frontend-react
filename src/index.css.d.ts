declare namespace IndexCssNamespace {
  export interface IIndexCss {
    'chip-spacer': string;
    'error-text': string;
    'error-text-small': string;
    'margin-b-10': string;
    'margin-b-20': string;
    'margin-r-10': string;
    'margin-r-30': string;
    'padding-30': string;
    'right-spacer': string;
  }
}

declare const IndexCssModule: IndexCssNamespace.IIndexCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexCssNamespace.IIndexCss;
};

export = IndexCssModule;
