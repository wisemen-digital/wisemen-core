import { Injectable, type Type } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper.js'

export interface NestjsProvider {
  providerClass: Type<unknown>
  instanceWrapper: InstanceWrapper<object>
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
          instanceWrapper: providerWrapper as InstanceWrapper<object>
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
