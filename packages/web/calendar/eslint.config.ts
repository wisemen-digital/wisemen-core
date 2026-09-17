import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig({
    tailwindConfigPath: 'src/index.css',
  })),
  {
    files: [
      '**/*.story.ts',
      '**/*.story.tsx',
      '**/*Playground.vue',
    ],
    rules: {
      'eslint-plugin-wisemen/explicit-function-return-type-with-regex': 'off',
    },
  },
  {
    // i18n prop is explicitly deferred per ROADMAP.md Phase 5; this package has no vue-i18n dependency
    rules: {
      '@intlify/vue-i18n/no-raw-text': 'off',
    },
  },
  {
    files: [
      '.storybook/**',
    ],
    rules: {
      'better-tailwindcss/no-unknown-classes': [
        'error',
        {
          ignore: [
            '^default$',
            '^light$',
          ],
        },
      ],
    },
  },
]
