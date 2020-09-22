declare namespace MyLibraryCssNamespace {
  export interface IMyLibraryCss {
    'actions-div': string;
    'card-style': string;
    'card-style-add-user': string;
    'card-title': string;
    'error-container': string;
    'error-div': string;
    'error-div-content': string;
    'error-div-icon': string;
    'input-div-style': string;
    'input-style-add-user': string;
    'input-style-add-user-half': string;
    'inter-control-spacing': string;
    'label-and-input-div': string;
    'right-spacer-control': string;
    'table-style': string;
  }
}

declare const MyLibraryCssModule: MyLibraryCssNamespace.IMyLibraryCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MyLibraryCssNamespace.IMyLibraryCss;
};

export = MyLibraryCssModule;
