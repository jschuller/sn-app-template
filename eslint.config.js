import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
    { ignores: ['dist/', 'target/', '.now/', '@types/', 'src/fluent/generated/'] },

    // React UI page code (bundled by now-sdk, runs in the browser).
    {
        files: ['src/client/**/*.{js,jsx}'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser },
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { 'react-hooks': reactHooks },
        rules: {
            ...js.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
        },
    },

    // Script Includes run on the instance (Rhino): ES5 globals from the platform.
    {
        files: ['src/server/**/*.server.js'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 5,
            sourceType: 'script',
            globals: { Class: 'readonly', gs: 'readonly', GlideRecord: 'readonly', GlideRecordSecure: 'readonly', GlideAggregate: 'readonly' },
        },
        rules: {
            ...js.configs.recommended.rules,
            // Script Includes declare their class as a top-level global by design.
            'no-unused-vars': ['error', { vars: 'local', caughtErrors: 'none' }],
        },
    },

    // Repository tooling (Node).
    {
        files: ['scripts/**/*.mjs', 'eslint.config.js'],
        ...js.configs.recommended,
        languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.node } },
    },
];
