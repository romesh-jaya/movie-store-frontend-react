// Some settings automatically inherited from .editorconfig

module.exports = {
  printWidth: 200,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  overrides: [
    {
      files: '.editorconfig',
      options: { parser: 'yaml' }
    },
    {
      files: 'LICENSE',
      options: { parser: 'markdown' }
    }
  ]
};
