import { Inject, Injectable, OnModuleInit } from "@nestjs/common"
import { FeatureFlag, isFlag } from "./feature-flag.js"
import { globSync } from "fs"
import { resolve } from "node:path"

export const FEATURE_FLAG_REGISTRY_TOKEN = 'wisemen.nestjs-feature-flag-registry.options'

export interface FeatureFlagRegistryOptions {
  flagsGlob: string
}

@Injectable()
export class FeatureFlagRegistry implements OnModuleInit {
  readonly flags: FeatureFlag[] = []

  constructor (
    @Inject(FEATURE_FLAG_REGISTRY_TOKEN) private options: FeatureFlagRegistryOptions
  ) {}

  async onModuleInit (): Promise<void> {
    const files = globSync(this.options.flagsGlob)

    for (const file of files) {
      const absolutePath = resolve(process.cwd(), file)
      const moduleExports = await import(absolutePath) as Record<string, object>

      for (const exportedKey in moduleExports) {
        const exported = moduleExports[exportedKey]

        if (typeof exported !== 'object') {
          continue
        }

        if (isFlag(exported)) {
          this.flags.push(exported)
        }
      }
    }
  }
}