module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    env: {
        es6: true,
        browser: true
    },
    rules: {
        semi: [2, 'never'],
        quotes: [2, 'single', { avoidEscape: true }]
    },
    plugins: ['svelte3'],
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3',
            settings: { 'svelte3/ignore-styles': () => true },
            rules: {
                'missing-declaration': [2, 'never']
            }
        }
    ],
    globals: {
        __COMMIT_HASH__: 'readonly'
    }
}
