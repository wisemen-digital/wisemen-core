/* eslint-disable antfu/no-top-level-await */
import { projectConfig } from '#configs/project.config.ts'

export default [
  ...(await projectConfig()),
]
