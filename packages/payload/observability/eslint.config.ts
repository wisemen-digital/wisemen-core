import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig({
    tailwindDisabled: true,
  })),
  {
    rules: {
      'eslint-plugin-wisemen/explicit-function-return-type-with-regex': 'off',
    },
  },
]
