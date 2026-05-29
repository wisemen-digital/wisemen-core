import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig({
    tailwindDisabled: true,
  })),
  {
    rules: {
      'ts/explicit-function-return-type': 'off',
    },
  },
]
