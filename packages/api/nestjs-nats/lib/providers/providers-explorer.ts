import { Injectable, type Type } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'

export interface NestjsProvider {
  providerClass: Type<unknown>
  providerInstance: object
}

@Injectable()
export class ProvidersExplorer {
  private _providers: NestjsProvider[] = []
  private isInitialized = false

  constructor (private readonly modules: ModulesContainer) {}

  init (): void {
    for (const moduleWrapper of this.modules.values()) {
      for (const providerWrapper of moduleWrapper.providers.values()) {
        const providerClass = providerWrapper.metatype

        if (providerClass == null) {
          continue
        }

        if (!Object.hasOwn(providerClass, 'prototype')) {
          continue
        }

        this._providers.push({
          providerClass: providerClass as Type<unknown>,
          providerInstance: providerWrapper.instance as object
        })
      }
    }
  }

  get providers (): NestjsProvider[] {
    if (!this.isInitialized) {
      this.init()
      this.isInitialized = true
    }

    return Array.from(this._providers)
  }
}
