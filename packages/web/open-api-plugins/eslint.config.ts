import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig()),
  {
    rules: {
      'ts/explicit-function-return-type': 'off',
    },
  },
]
