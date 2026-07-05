// oxlint-disable typescript-eslint(unbound-method)
import { after } from 'node:test'
import { FeatureFlags } from './feature-flags.js'
import { Client, EvaluationContext, FlagEvaluationOptions, JsonValue } from '@openfeature/nestjs-sdk'
import { BooleanFeatureFlag, EnumFeatureFlag, StringFeatureFlag, NumberFeatureFlag, ObjectFeatureFlag, FeatureFlag } from './feature-flag.js'

type EnumType = Record<string, string>
type FeatureFlagClientMethods = Partial<{
  [K in keyof Client]: Client[K]
}>

export class FeatureFlagsStub {
  private flags: FeatureFlags
  private clientPrototype: Client
  private originalGet: FeatureFlags['get']
  private originalClientMethods: FeatureFlagClientMethods
  private overrides: Map<string, JsonValue>

  constructor (flags: FeatureFlags) {
    this.flags = flags
    const client = Reflect.get(flags, 'client') as Client

    this.clientPrototype = Object.getPrototypeOf(client) as Client
    this.originalGet = flags.get.bind(flags)
    this.originalClientMethods = this.getClientMethods(this.clientPrototype)
    this.overrides = new Map()

    this.flags.get = ((
      flag: Parameters<FeatureFlags['get']>['0'],
      context?: Parameters<FeatureFlags['get']>['1'],
      options?: Parameters<FeatureFlags['get']>['2']
    ) => {
      if (this.overrides.has(flag.name)) {
        return this.overrides.get(flag.name)
      }

      return this.originalGet(flag, context, options)
    }) as unknown as FeatureFlags['get']

    this.stubClient(this.clientPrototype, this.originalClientMethods)
  }

  mockFlag (flag: BooleanFeatureFlag, value: boolean): void
  mockFlag<TEnum extends EnumType> (flag: EnumFeatureFlag<TEnum>, value: TEnum[keyof TEnum]): void
  mockFlag (flag: StringFeatureFlag, value: string): void
  mockFlag (flag: NumberFeatureFlag, value: number): void
  mockFlag<T extends JsonValue> (flag: ObjectFeatureFlag<T>, value: T): void
  mockFlag<TEnum extends Record<string, string>, T extends JsonValue> (
    flag: FeatureFlag<TEnum, T>,
    value: boolean | string | number | T
  ): void {
    this.overrides.set(flag.name, value)

    after(() => this.overrides.delete(flag.name))
  }

  reset () {
    this.overrides.clear()
    this.flags.get = this.originalGet
    Object.assign(this.clientPrototype, this.originalClientMethods)
  }

  private getClientMethods (client: Client): FeatureFlagClientMethods {
    return {
      getBooleanValue: client.getBooleanValue,
      getStringValue: client.getStringValue,
      getNumberValue: client.getNumberValue,
      getObjectValue: client.getObjectValue
    }
  }

  private stubClient<TClient extends Client> (
    client: TClient,
    originalMethods: FeatureFlagClientMethods
  ): TClient {
    const overrides = this.overrides

    client.getBooleanValue = function (
      this: Client,
      flagKey: string,
      defaultValue: boolean,
      context?: EvaluationContext,
      options?: FlagEvaluationOptions
    ): Promise<boolean> {
      if (overrides.has(flagKey)) {
        return Promise.resolve(overrides.get(flagKey) as boolean)
      }

      const result = Reflect.apply(
        originalMethods.getBooleanValue!,
        this,
        [flagKey, defaultValue, context, options]
      )

      return result
    }

    client.getStringValue = function (
      this: Client,
      flagKey: string,
      defaultValue: string,
      context?: EvaluationContext,
      options?: FlagEvaluationOptions
    ): Promise<string> {
      if (overrides.has(flagKey)) {
        return Promise.resolve(overrides.get(flagKey) as string)
      }

      const result = Reflect.apply(
        originalMethods.getStringValue!,
        this,
        [flagKey, defaultValue, context, options]
      )

      return result
    }

    client.getNumberValue = function (
      this: Client,
      flagKey: string,
      defaultValue: number,
      context?: EvaluationContext,
      options?: FlagEvaluationOptions
    ): Promise<number> {
      if (overrides.has(flagKey)) {
        return Promise.resolve(overrides.get(flagKey) as number)
      }

      const result = Reflect.apply(
        originalMethods.getNumberValue!,
        this,
        [flagKey, defaultValue, context, options]
      )

      return result
    }

    client.getObjectValue = function <T extends JsonValue> (
      this: Client,
      flagKey: string,
      defaultValue: T,
      context?: EvaluationContext,
      options?: FlagEvaluationOptions
    ): Promise<T> {
      if (overrides.has(flagKey)) {
        return Promise.resolve(overrides.get(flagKey) as T)
      }

      const result = Reflect.apply(
        originalMethods.getObjectValue!,
        this,
        [flagKey, defaultValue, context, options]
      )

      return result as Promise<T>
    }

    return client
  }
}
