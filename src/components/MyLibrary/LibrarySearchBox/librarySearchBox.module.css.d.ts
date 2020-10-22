declare namespace LibrarySearchBoxModuleCssNamespace {
  export interface ILibrarySearchBoxModuleCss {
    'button-div': string;
    'card-style': string;
    'card-title': string;
    'genre-button': string;
    'genre-output': string;
    'input-style-search': string;
    'input-style-search-genre': string;
    'input-style-search-half': string;
    'label-and-input-div': string;
  }
}

declare const LibrarySearchBoxModuleCssModule: LibrarySearchBoxModuleCssNamespace.ILibrarySearchBoxModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LibrarySearchBoxModuleCssNamespace.ILibrarySearchBoxModuleCss;
};

export = LibrarySearchBoxModuleCssModule;
