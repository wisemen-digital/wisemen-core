import type { DefaultValueTypes } from '#src/value-types.js'

/**
 * Describes the runtime value types that make up an event payload.
 */
export type EventDataDefinition<TValueTypes extends DefaultValueTypes = DefaultValueTypes> = Record<
  string,
  keyof TValueTypes
>

/**
 * Configures an event that can be emitted by the rule engine.
 */
export type Event<
  TEventId extends string = string,
  I18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes,
  TData extends EventDataDefinition<TValueTypes> = EventDataDefinition<TValueTypes>
> = {
  /** event unique identifier */
  id: TEventId
  /** i18n key for the name of this event */
  nameKey?: I18nPath
  /** i18n key for the description of this event */
  descriptionKey?: I18nPath
  /** data associated with this event */
  data: TData
}
