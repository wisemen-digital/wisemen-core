import { Injectable, type Type } from '@nestjs/common'
import { DiscoveryService } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper.js'

export interface NestjsProvider {
  providerClass: Type<unknown>
  providerInstance: object
  instanceWrapper: InstanceWrapper<object>
}

@Injectable()
export class ProviderExplorer {
  private readonly discoveredProviders: NestjsProvider[] = []
  private isInitialized = false

  constructor (private readonly discoveryService: DiscoveryService) {}

  get providers (): NestjsProvider[] {
    if (!this.isInitialized) {
      this.initialize()
      this.isInitialized = true
    }

    return Array.from(this.discoveredProviders)
  }

  private initialize (): void {
    for (const providerWrapper of this.discoveryService.getProviders()) {
      const providerClass = providerWrapper.metatype

      if (providerClass == null) {
        continue
      }

      if (!Object.hasOwn(providerClass, 'prototype')) {
        continue
      }

      this.discoveredProviders.push({
        providerClass: providerClass as Type<unknown>,
        providerInstance: providerWrapper.instance as object,
        instanceWrapper: providerWrapper as InstanceWrapper<object>
      })
    }
  }
}
