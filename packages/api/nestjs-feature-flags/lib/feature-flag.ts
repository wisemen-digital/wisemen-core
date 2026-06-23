import { JsonValue } from "@openfeature/nestjs-sdk"

type StringEnum = Record<string, string>
type StringEnumValue<TEnum extends StringEnum> = TEnum[keyof TEnum]

export interface BooleanFeatureFlag {
  name: string
  type: 'boolean',
  defaultValue: boolean
}

export interface StringFeatureFlag {
  name: string
  type: 'string',
  defaultValue: string
}

export interface EnumFeatureFlag<TEnum extends StringEnum> {
  name: string
  type: 'string',
  defaultValue: StringEnumValue<TEnum>,
  enum: TEnum
}

export interface NumberFeatureFlag {
  name: string
  type: 'number',
  defaultValue: number
}

export interface ObjectFeatureFlag<T extends JsonValue> {
  name: string
  type: 'object',
  defaultValue: T
}

export type FeatureFlag<TEnum extends StringEnum = StringEnum, T extends JsonValue = JsonValue> =
  BooleanFeatureFlag
  | StringFeatureFlag
  | EnumFeatureFlag<TEnum>
  | NumberFeatureFlag
  | ObjectFeatureFlag<T>

const FEATURE_FLAG_METADATA_KEY = 'wisemen:feature-flag'

export function createFlag (flag: BooleanFeatureFlag): BooleanFeatureFlag
export function createFlag (flag: StringFeatureFlag): StringFeatureFlag
export function createFlag (flag: NumberFeatureFlag): NumberFeatureFlag
export function createFlag<TEnum extends StringEnum>(flag: EnumFeatureFlag<TEnum>): EnumFeatureFlag<TEnum>
export function createFlag<T extends JsonValue>(flag: ObjectFeatureFlag<T>): ObjectFeatureFlag<T>
export function createFlag<TEnum extends StringEnum, T extends JsonValue>(flag: FeatureFlag<TEnum, T>): FeatureFlag<TEnum, T> {
  Reflect.defineMetadata(FEATURE_FLAG_METADATA_KEY, true, flag)
  return flag
}

export function isFlag(flag: object): flag is FeatureFlag {
  return Reflect.hasMetadata(FEATURE_FLAG_METADATA_KEY, flag)
}
