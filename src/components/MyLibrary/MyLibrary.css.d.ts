declare namespace MyLibraryCssNamespace {
  export interface IMyLibraryCss {
    'card-style': string;
    'card-title': string;
    'input-style-add-user': string;
    'input-style-add-user-half': string;
    'label-and-input-div': string;
    'pagination-style': string;
    'table-style': string;
  }
}

declare const MyLibraryCssModule: MyLibraryCssNamespace.IMyLibraryCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MyLibraryCssNamespace.IMyLibraryCss;
};

export = MyLibraryCssModule;
