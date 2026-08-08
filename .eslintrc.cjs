module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['jsx-a11y'],
  extends: ['plugin:jsx-a11y/recommended'],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'jsx-a11y/label-has-associated-control': 'off',
  },
};
