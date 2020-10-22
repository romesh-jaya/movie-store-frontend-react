declare namespace NumberRangeInputModuleCssNamespace {
  export interface INumberRangeInputModuleCss {
    'input-style-search': string;
  }
}

declare const NumberRangeInputModuleCssModule: NumberRangeInputModuleCssNamespace.INumberRangeInputModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NumberRangeInputModuleCssNamespace.INumberRangeInputModuleCss;
};

export = NumberRangeInputModuleCssModule;
