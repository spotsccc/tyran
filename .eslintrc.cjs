const { configure, presets } = require('eslint-kit')

module.exports = configure({
  presets: [
    presets.react({ version: '18.0' }),
    presets.effector(),
    presets.prettier(),
    presets.typescript(),
    presets.node(),
  ],
  extend: {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
})
