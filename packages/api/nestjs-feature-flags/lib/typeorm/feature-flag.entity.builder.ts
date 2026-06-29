import { GoFeatureFlagConfig } from '../go-feature-flag.config.js'
import { FeatureFlagEntity } from './feature-flag.entity.js'

export class FeatureFlagBuilder {
  private featureFlag: FeatureFlagEntity

  constructor () {
    this.featureFlag = new FeatureFlagEntity()
  }

  withFlagName (flagName: string): this {
    this.featureFlag.name = flagName
    return this
  }

  withFlagset (flagset: string): this {
    this.featureFlag.set = flagset
    return this
  }

  withConfig (config: GoFeatureFlagConfig): this {
    this.featureFlag.config = config
    return this
  }

  build (): FeatureFlagEntity {
    return this.featureFlag
  }
}
