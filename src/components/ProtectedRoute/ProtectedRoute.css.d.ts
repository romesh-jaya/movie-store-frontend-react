declare namespace ProtectedRouteCssNamespace {
  export interface IProtectedRouteCss {
    'spinner-full-page': string;
  }
}

declare const ProtectedRouteCssModule: ProtectedRouteCssNamespace.IProtectedRouteCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProtectedRouteCssNamespace.IProtectedRouteCss;
};

export = ProtectedRouteCssModule;
