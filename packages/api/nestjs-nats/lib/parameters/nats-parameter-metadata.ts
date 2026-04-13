import type { Type } from '@nestjs/common'

export interface NatsParameterMetadata {
  metaType?: Type<unknown>
}
