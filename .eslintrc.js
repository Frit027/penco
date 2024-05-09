module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'airbnb-typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        indent: ['error', 4],
        'max-len': ['error', { code: 120 }],
        'no-console': ['warn', { allow: ['log'] }],
        'object-curly-newline': ['error', { consistent: true }],
        'import/prefer-default-export': 0,
        '@typescript-eslint/indent': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/function-component-definition': [2, {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
        }],
        'react/jsx-indent-props': ['error', 4],
    },
};
