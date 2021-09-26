module.exports = {
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  env: {
    node: true,
    es6: true
  },
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 'off',
    'brace-style': "error"
  },
  parserOptions: {
    sourceType: 'module'
  }
};
