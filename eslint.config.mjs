// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  name: 'portfolio/rules',
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'error',
  },
})
