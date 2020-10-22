declare namespace ContainerHeaderModuleCssNamespace {
  export interface IContainerHeaderModuleCss {
    'div-logo': string;
    header: string;
    'header-text': string;
    'nowrap-div': string;
  }
}

declare const ContainerHeaderModuleCssModule: ContainerHeaderModuleCssNamespace.IContainerHeaderModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContainerHeaderModuleCssNamespace.IContainerHeaderModuleCss;
};

export = ContainerHeaderModuleCssModule;
