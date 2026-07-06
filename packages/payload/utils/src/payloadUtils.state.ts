import type {
  PayloadUtilsConfig,
} from '#payloadUtils.types.ts'

let payloadUtilsConfig: PayloadUtilsConfig | null = null

export function setPayloadUtilsConfig(config: PayloadUtilsConfig): void {
  payloadUtilsConfig = {
    ...config,
  }
}

export function readPayloadUtilsConfig(): PayloadUtilsConfig | null {
  return payloadUtilsConfig
}
