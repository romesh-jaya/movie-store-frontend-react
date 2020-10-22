declare namespace IndexModuleCssNamespace {
  export interface IIndexModuleCss {
    'chip-spacer': string;
    'error-text': string;
    'error-text-small': string;
    'margin-b-10': string;
    'margin-b-20': string;
    'margin-r-10': string;
    'margin-r-30': string;
    'margin-t-20': string;
    'padding-30': string;
    'right-spacer': string;
  }
}

declare const IndexModuleCssModule: IndexModuleCssNamespace.IIndexModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModuleCssNamespace.IIndexModuleCss;
};

export = IndexModuleCssModule;
