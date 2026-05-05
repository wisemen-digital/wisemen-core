import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig({
    tailwindConfigPath: 'src/styles/index.css',
  })),
  {
    rules: {
      'better-tailwindcss/no-unknown-classes': [
        'error',
        {
          ignore: [
            '^group(?:\\/(\\S*))?$',
            '^peer(?:\\/(\\S*))?$',
            '^custom-(?:\\S+)?$',
            '^z-(sticky|overlay|modal|tooltip)$',
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.story.ts',
      '**/*.story.tsx',
      '**/*.stories.ts',
      '**/*.stories.tsx',
    ],
    rules: {
      'eslint-plugin-wisemen/explicit-function-return-type-with-regex': 'off',
    },
  },
  {
    files: [
      '**/*Playground.vue',
    ],
    rules: {
      '@intlify/vue-i18n/no-raw-text': 'off',
    },
  },
]
