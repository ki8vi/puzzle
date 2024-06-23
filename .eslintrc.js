module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['prettier', '@typescript-eslint'],
    root: true,
    rules: {
        'no-debugger': 'off',
        'prettier/prettier': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'import/extensions': 'off',
        'no-console': 0,
        'import/prefer-default-export': 'off' | 'warn' | 'error',
    },
};
