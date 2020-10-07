declare namespace LibrarySearchBoxCssNamespace {
  export interface ILibrarySearchBoxCss {
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

declare const LibrarySearchBoxCssModule: LibrarySearchBoxCssNamespace.ILibrarySearchBoxCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LibrarySearchBoxCssNamespace.ILibrarySearchBoxCss;
};

export = LibrarySearchBoxCssModule;
