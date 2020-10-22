declare namespace AlertConfirmationModuleCssNamespace {
  export interface IAlertConfirmationModuleCss {
    'close-button': string;
    'first-button': string;
    header: string;
    title: string;
  }
}

declare const AlertConfirmationModuleCssModule: AlertConfirmationModuleCssNamespace.IAlertConfirmationModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AlertConfirmationModuleCssNamespace.IAlertConfirmationModuleCss;
};

export = AlertConfirmationModuleCssModule;
