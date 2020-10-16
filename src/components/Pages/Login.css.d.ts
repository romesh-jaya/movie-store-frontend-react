declare namespace LoginCssNamespace {
  export interface ILoginCss {
    'login-div': string;
    'spinner-full-page': string;
  }
}

declare const LoginCssModule: LoginCssNamespace.ILoginCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoginCssNamespace.ILoginCss;
};

export = LoginCssModule;
