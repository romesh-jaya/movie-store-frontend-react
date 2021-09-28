declare namespace NavbarModuleCssNamespace {
  export interface INavbarModuleCss {
    'logout-button': string;
    'my-library': string;
    'tabs-div': string;
  }
}

declare const NavbarModuleCssModule: NavbarModuleCssNamespace.INavbarModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavbarModuleCssNamespace.INavbarModuleCss;
};

export = NavbarModuleCssModule;
