declare namespace MyLibraryModuleCssNamespace {
  export interface IMyLibraryModuleCss {
    'link-button': string;
    'pagination-style': string;
    'responsive-content': string;
    'table-style': string;
  }
}

declare const MyLibraryModuleCssModule: MyLibraryModuleCssNamespace.IMyLibraryModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MyLibraryModuleCssNamespace.IMyLibraryModuleCss;
};

export = MyLibraryModuleCssModule;
