declare namespace ContainerBodyModuleCssNamespace {
  export interface IContainerBodyModuleCss {
    'logout-button': string;
    'my-library': string;
    'tabs-div': string;
  }
}

declare const ContainerBodyModuleCssModule: ContainerBodyModuleCssNamespace.IContainerBodyModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContainerBodyModuleCssNamespace.IContainerBodyModuleCss;
};

export = ContainerBodyModuleCssModule;
