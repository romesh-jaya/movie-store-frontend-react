declare namespace AlertConfirmationCssNamespace {
  export interface IAlertConfirmationCss {
    'close-button': string;
    'first-button': string;
    header: string;
    title: string;
  }
}

declare const AlertConfirmationCssModule: AlertConfirmationCssNamespace.IAlertConfirmationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AlertConfirmationCssNamespace.IAlertConfirmationCss;
};

export = AlertConfirmationCssModule;
