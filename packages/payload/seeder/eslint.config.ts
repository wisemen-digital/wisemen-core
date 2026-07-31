import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  {
    ignores: [
      '**/_kit/**',
    ],
  },
  ...(await packageConfig({
    tailwindDisabled: true,
  })),
  {
    rules: {
      'e18e/prefer-static-regex': 'off',
      'eslint-plugin-wisemen/explicit-function-return-type-with-regex': 'off',
      'func-style': 'off',
      'node/prefer-global/process': 'off',
      'unicorn/prefer-set-has': 'off',
    },
  },
]
