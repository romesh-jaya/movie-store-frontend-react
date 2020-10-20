declare namespace MyLibraryScssNamespace {
  export interface IMyLibraryScss {
    'link-button': string;
    'pagination-style': string;
    'responsive-content': string;
    'table-style': string;
  }
}

declare const MyLibraryScssModule: MyLibraryScssNamespace.IMyLibraryScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MyLibraryScssNamespace.IMyLibraryScss;
};

export = MyLibraryScssModule;
