declare namespace LibrarySearchBoxModuleCssNamespace {
  export interface ILibrarySearchBoxModuleCss {
    'button-div': string;
    'card-style': string;
    'card-title': string;
    genre: string;
    'genre-button': string;
    helpicon: string;
    helptext: string;
    'input-style-form-control': string;
    'input-style-search': string;
    'input-style-search-genre': string;
    'input-style-select': string;
    'label-and-input-div': string;
  }
}

declare const LibrarySearchBoxModuleCssModule: LibrarySearchBoxModuleCssNamespace.ILibrarySearchBoxModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LibrarySearchBoxModuleCssNamespace.ILibrarySearchBoxModuleCss;
};

export = LibrarySearchBoxModuleCssModule;
