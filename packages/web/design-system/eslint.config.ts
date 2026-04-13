import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig({
    tailwindConfigPath: 'src/styles/index.css',
  })),
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
]
