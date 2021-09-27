module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'no-console': 'off',
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 'off',
    'brace-style': 'error',
    'react/jsx-indent': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'function',
        format: ['PascalCase', 'camelCase'],
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'arrow-body-style': 0,
    'react/display-name': 'off',
    'no-var': 'error',
  },
  plugins: ['@typescript-eslint'],
};
