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
    'no-param-reassign': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'no-underscore-dangle': 0,
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
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['playwright.config.ts', 'src/*.test.ts', 'src/testTool.ts'],
        optionalDependencies: false,
      },
    ],
  },
}
