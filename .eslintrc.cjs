module.exports = {
  extends: 'airbnb-base',
  rules: {
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-return-assign': 0,
    semi: ['error', 'always'],
    'no-confusing-arrow': 0,
    'no-console': 0,
    strict: 0,
    'max-len': ['error', { code: 120, ignoreComments: true, ignoreStrings: true }],
    // see https://github.com/prettier/prettier/issues/3847
    'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
};
