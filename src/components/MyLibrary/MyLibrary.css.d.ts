declare namespace MyLibraryCssNamespace {
  export interface IMyLibraryCss {
    'button-div': string;
    'card-style': string;
    'card-title': string;
    'genre-button': string;
    'genre-output': string;
    'input-style-search': string;
    'input-style-search-genre': string;
    'input-style-search-half': string;
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
