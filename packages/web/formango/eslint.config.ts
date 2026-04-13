import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig()),
  {
    rules: {
      'require-explicit-generics/require-explicit-generics': 'off',
      'ts/explicit-function-return-type': 'off',
    },
  },
]
