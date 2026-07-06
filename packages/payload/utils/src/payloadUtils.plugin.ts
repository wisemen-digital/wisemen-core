import type { Plugin } from 'payload'

import type { PayloadUtilsConfig } from '#payloadUtils.types.ts'

import { initializePayloadUtils } from './payloadUtils'

export function payloadUtilsPlugin(config: PayloadUtilsConfig): Plugin {
  const plugin: Plugin = async (payloadConfig) => {
    initializePayloadUtils(config)

    return payloadConfig
  }

  return plugin
}
