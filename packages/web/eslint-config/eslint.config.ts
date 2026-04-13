import { packageConfig } from './src/index.ts'

export default [
  ...(await packageConfig()),
]
