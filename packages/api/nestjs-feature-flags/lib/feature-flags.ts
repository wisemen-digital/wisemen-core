import { Injectable } from "@nestjs/common";
import { Client, EvaluationContext, FlagEvaluationOptions, JsonValue, OpenFeatureClient } from "@openfeature/nestjs-sdk";
import {
  BooleanFeatureFlag,
  EnumFeatureFlag,
  FeatureFlag,
  NumberFeatureFlag,
  ObjectFeatureFlag,
  StringFeatureFlag,
} from "./feature-flag.js";
import { FeatureFlagEntity as FlagEntity } from './typeorm/feature-flag.entity.js';
import { DataSource } from "typeorm";
import { FeatureFlagRegistry } from "./feature-flag.registry.js";
import { GoFeatureFlagConfig } from "./go-feature-flag.config.js";
import { FeatureFlagBuilder } from "./typeorm/feature-flag.entity.builder.js";
import { SynchronizeConfigRepository } from "./synchronize-config.repository.js";
import { transaction } from "@wisemen/nestjs-typeorm";

export interface SynchronizeConfigOptions {
  deleteUnknownFlags?: boolean
}

@Injectable()
export class FeatureFlags {
  constructor (
    @OpenFeatureClient() private client: Client,
    private registry: FeatureFlagRegistry
  ) { }

  async get (
    flag: BooleanFeatureFlag,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<boolean>

  async get<TEnum extends Record<string, string>> (
    flag: EnumFeatureFlag<TEnum>,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<TEnum[keyof TEnum]>

  async get (
    flag: StringFeatureFlag,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<string>

  async get (
    flag: NumberFeatureFlag,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<number>

  async get<T extends JsonValue> (
    flag: ObjectFeatureFlag<T>,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<T>

  async get<TEnum extends Record<string, string>, T extends JsonValue> (
    flag: FeatureFlag<TEnum, T>,
    context?: EvaluationContext,
    options?: FlagEvaluationOptions
  ): Promise<boolean | string | number | T> {
    switch (flag.type) {
      case "boolean":
        return this.client.getBooleanValue(
          flag.name,
          flag.defaultValue,
          context,
          options
        );
      case "string":
        return this.client.getStringValue(
          flag.name,
          flag.defaultValue,
          context,
          options
        );
      case "number":
        return this.client.getNumberValue(
          flag.name,
          flag.defaultValue,
          context,
          options
        );
      case "object":
        return this.client.getObjectValue(
          flag.name,
          flag.defaultValue,
          context,
          options
        ) as Promise<T>;
      default:
        throw new Error("Unsupported feature flag type");
    }
  }

  async synchronizeConfig (
    dataSource: DataSource,
    options?: SynchronizeConfigOptions
  ): Promise<void> {
    const repo = new SynchronizeConfigRepository(dataSource)
    const existingFeatureFlags = await repo.getExistingFeatureFlags()
    const featureFlags: FlagEntity[] = []

    for (const flag of this.registry.flags) {
      const newConfig = this.buildFeatureFlagConfig(flag)
      const existingConfig = existingFeatureFlags.get(flag.name)

      const config: GoFeatureFlagConfig = {
        ...existingConfig,
        ...newConfig
      }

      featureFlags.push(
        new FeatureFlagBuilder()
          .withFlagName(flag.name)
          .withFlagset('')
          .withConfig(config)
          .build()
      )
    }

    await transaction(dataSource, async () => {
      await repo.upsert(featureFlags)

      if (options?.deleteUnknownFlags === true) {
        const flagNames = this.registry.flags.map(f => f.name)
        await repo.deleteUnknownFlags(flagNames)
      }
    })
  }


  private buildFeatureFlagConfig (flag: FeatureFlag): GoFeatureFlagConfig {
    const config: GoFeatureFlagConfig = {
      variations: {
        default: flag.defaultValue
      },
      defaultRule: {
        variation: 'default'
      }
    }

    if ('enum' in flag) {
      for (const enumValue of Object.values(flag.enum)) {
        config.variations[enumValue] = enumValue
      }
    }

    return config
  }
}
