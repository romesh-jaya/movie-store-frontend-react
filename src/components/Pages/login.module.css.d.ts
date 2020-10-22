declare namespace LoginModuleCssNamespace {
  export interface ILoginModuleCss {
    'login-div': string;
  }
}

declare const LoginModuleCssModule: LoginModuleCssNamespace.ILoginModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoginModuleCssNamespace.ILoginModuleCss;
};

export = LoginModuleCssModule;
