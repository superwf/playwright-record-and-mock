module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        eslintIntegration: true,
        stylelintIntegration: true,
        printWidth: 120,
        useTabs: false,
        tabWidth: 2,
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        jsxBracketSameLine: false,
        endOfLine: 'auto',
        arrowParens: 'avoid',
      },
      { usePrettierrc: false },
    ],
    'import/prefer-default-export': 0,
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'never'],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'no-console': 0,
        'no-empty': 0,
      },
    },
  ],
}
