declare namespace NumberRangeInputCssNamespace {
  export interface INumberRangeInputCss {
    'input-style-add-user': string;
  }
}

declare const NumberRangeInputCssModule: NumberRangeInputCssNamespace.INumberRangeInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NumberRangeInputCssNamespace.INumberRangeInputCss;
};

export = NumberRangeInputCssModule;
