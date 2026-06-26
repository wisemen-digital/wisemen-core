import { RequireFlagsEnabled } from '@openfeature/nestjs-sdk'
import { BooleanFeatureFlag } from './feature-flag.js'

export function RequireFlags (...requiredFlags: BooleanFeatureFlag[]): MethodDecorator {
  const flags = requiredFlags.map((f) => ({
    flagKey: f.name,
    defaultValue: f.defaultValue
  }))

  return RequireFlagsEnabled({ flags: flags })
}
