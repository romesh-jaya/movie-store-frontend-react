declare namespace ProtectedRouteModuleCssNamespace {
  export interface IProtectedRouteModuleCss {
    'spinner-full-page': string;
  }
}

declare const ProtectedRouteModuleCssModule: ProtectedRouteModuleCssNamespace.IProtectedRouteModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProtectedRouteModuleCssNamespace.IProtectedRouteModuleCss;
};

export = ProtectedRouteModuleCssModule;
