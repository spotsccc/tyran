const { configure, presets } = require('eslint-kit')

module.exports = configure({
  presets: [
    presets.imports(),
    presets.typescript(),
    presets.node(),
    presets.prettier(),
  ],
  extend: {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/return-await': 'off',
    },
  },
})
