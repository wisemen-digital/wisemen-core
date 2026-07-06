import type { Plugin } from 'payload'
import {
  initializePayloadUtils,
} from './payloadUtils'
import type {  PayloadUtilsConfig } from '#payloadUtils.types.ts'

export function payloadUtilsPlugin(config: PayloadUtilsConfig): Plugin {
  const plugin: Plugin = async (payloadConfig) => {
    initializePayloadUtils(config)

    return payloadConfig
  }

  return plugin
}
