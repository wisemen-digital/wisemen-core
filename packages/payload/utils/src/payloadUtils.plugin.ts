/* eslint-disable func-style */
import type { Plugin } from 'payload'

import type { PayloadUtilsConfig } from '#payloadUtils.types.ts'

import { initializePayloadUtils } from './payloadUtils'

export function payloadUtilsPlugin(config: PayloadUtilsConfig): Plugin {
  initializePayloadUtils(config)

  const plugin: Plugin = (payloadConfig) => {
    initializePayloadUtils(config)

    return payloadConfig
  }

  return plugin
}
