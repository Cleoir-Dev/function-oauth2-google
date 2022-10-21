module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'require-jsdoc': 0,
    'prefer-promise-reject-errors': 'off',
  },
};
