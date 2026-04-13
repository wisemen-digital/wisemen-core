import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig()),
  {
    ignores: [
      '**/src/components/sonner/Toaster.vue',
    ],
  },
]
