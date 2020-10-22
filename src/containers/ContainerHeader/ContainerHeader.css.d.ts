declare namespace ContainerHeaderCssNamespace {
  export interface IContainerHeaderCss {
    'div-logo': string;
    header: string;
    'header-text': string;
    'nowrap-div': string;
  }
}

declare const ContainerHeaderCssModule: ContainerHeaderCssNamespace.IContainerHeaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContainerHeaderCssNamespace.IContainerHeaderCss;
};

export = ContainerHeaderCssModule;
