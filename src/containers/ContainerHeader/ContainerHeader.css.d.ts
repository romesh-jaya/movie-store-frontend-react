declare namespace ContainerHeaderCssNamespace {
  export interface IContainerHeaderCss {
    div1: string;
    header: string;
    headerText: string;
    nowrapDiv: string;
  }
}

declare const ContainerHeaderCssModule: ContainerHeaderCssNamespace.IContainerHeaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContainerHeaderCssNamespace.IContainerHeaderCss;
};

export = ContainerHeaderCssModule;
