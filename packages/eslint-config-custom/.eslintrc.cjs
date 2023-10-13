const { configure, presets } = require('eslint-kit')

module.exports = configure({
  presets: [
    presets.prettier({
      semi: false,
      trailingComma: 'all',
      singleQuote: true,
      printWidth: 80,
      useTabs: false,
      tabWidth: 2,
    }),
  ],
  extend: {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/return-await': 'off',
    },
  },
})
