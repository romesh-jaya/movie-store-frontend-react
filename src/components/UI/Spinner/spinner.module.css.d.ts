declare namespace SpinnerModuleCssNamespace {
  export interface ISpinnerModuleCss {
    'loading-spinner': string;
    loadingspin: string;
    'spinner-body': string;
  }
}

declare const SpinnerModuleCssModule: SpinnerModuleCssNamespace.ISpinnerModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SpinnerModuleCssNamespace.ISpinnerModuleCss;
};

export = SpinnerModuleCssModule;
