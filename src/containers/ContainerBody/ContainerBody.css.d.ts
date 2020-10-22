declare namespace ContainerBodyCssNamespace {
  export interface IContainerBodyCss {
    'logout-button': string;
    'my-library': string;
    'tabs-div': string;
  }
}

declare const ContainerBodyCssModule: ContainerBodyCssNamespace.IContainerBodyCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContainerBodyCssNamespace.IContainerBodyCss;
};

export = ContainerBodyCssModule;
