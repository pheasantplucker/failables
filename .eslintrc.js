module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 8,
  },
  plugins: ['prettier'],
  rules: {
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false },
    ],
    'no-undef': ['error', { typeof: true }],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        semi: false,
        useTabs: false,
        printWidth: 80,
        tabWidth: 2,
      },
    ],
  },
  globals: {
    console: true,
    document: true,
    window: true,
    module: true,
    require: true,
    describe: true,
    it: true,
    process: true,
    setInterval: true,
    setTimeout: true,
    clearInterval: true,
    clearTimeout: true,
    jasmine: true,
    Buffer: true,
    test: true,
  },
}
