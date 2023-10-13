const { configure, presets } = require('eslint-kit')

module.exports = configure({
  mode: 'only-errors',
  presets: [
    presets.imports(),
    presets.typescript(),
    presets.prettier(),
    presets.node(),
    presets.react({ version: '18.0' }),
    presets.effector(),
  ],
  extend: {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/return-await': 'off',
    },
  },
})
