import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig()),
]
