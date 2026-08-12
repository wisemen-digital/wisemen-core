import { Almanac } from '#src/almanac.js'
import { ConditionFactory, type Condition, type ConditionOptions } from '#src/condition.js'
import type { EventDataDefinition, Event } from '#src/event.js'
import type { AnyOperator } from '#src/operator.js'
import type { RunTimeValue } from '#src/runtime-value.js'
import type { DefaultValueTypes } from '#src/value-types.js'


/**
 * Configures the event emitted when a rule matches.
 */
export interface RuleEventOptions {
  /** The id of the event to emit */
  id: string

  /** The relevant data for the event */
  data: Record<PropertyKey, RunTimeValue>
}

/**
 * Configures a rule as a condition and emitted event pair.
 */
export interface RuleOptions {
  condition: ConditionOptions
  event: RuleEventOptions
}

type AnyEventOptions<
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = Event<string, string, TValueTypes, EventDataDefinition<TValueTypes>>

/**
 * Resolves an event payload definition into concrete runtime values.
 */
export type RuleEventData<
  TEventData extends EventDataDefinition<TValueTypes>,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = {
  [TKey in keyof TEventData]: TValueTypes[TEventData[TKey]]
}

/**
 * Resolves an event definition into the concrete event emitted by a matching rule.
 */
export type RuleEvent<
  TValueTypes extends DefaultValueTypes = DefaultValueTypes,
  TEvent extends AnyEventOptions<TValueTypes> = AnyEventOptions<TValueTypes>,
> = TEvent extends AnyEventOptions<TValueTypes>
  ? {
      id: TEvent['id']
      data: RuleEventData<TEvent['data'], TValueTypes>
    }
  : never

/**
 * Runtime rule that evaluates conditions and emits typed events.
 */
export class Rule<TValueTypes extends DefaultValueTypes = DefaultValueTypes> {
  readonly condition: Condition<TValueTypes>
  readonly eventOptions: RuleEventOptions

  constructor (options: RuleOptions) {
    this.condition = ConditionFactory.create(options.condition)
    this.eventOptions = options.event
  }

  /**
   * Evaluates the rule, starting with the root boolean operator and recursing down
   * All evaluation is done within the context of an almanac
   */
  evaluate<TEvent extends AnyEventOptions<TValueTypes>> (
    almanac: Almanac<TValueTypes>,
    operators: Map<string, AnyOperator<string, TValueTypes>>,
    events: Map<TEvent['id'], TEvent>
  ): RuleEvent<TValueTypes, TEvent> | null {
    if (!this.condition.evaluate(almanac, operators)) {
      return null
    }

    const eventDefinition = events.get(this.eventOptions.id)
    if (eventDefinition === undefined) {
      throw new Error(`event ${this.eventOptions.id} not found`)
    }

    const eventDataDefinition = eventDefinition.data as TEvent['data']
    const eventData = {} as RuleEventData<TEvent['data'], TValueTypes>
    for (const key in this.eventOptions.data) {
      const eventKey = key as keyof TEvent['data']
      const valueType = eventDataDefinition[eventKey]
      eventData[eventKey] = almanac.resolve(
        valueType,
        this.eventOptions.data[key]
      ) as RuleEventData<TEvent['data'], TValueTypes>[typeof eventKey]
    }

    return {
      id: eventDefinition.id as TEvent['id'],
      data: eventData
    } as RuleEvent<TValueTypes, TEvent>
  }

  /**
   * Serializes the rule back to its JSON representation.
   */
  toJSON (): RuleOptions {
    return {
      condition: this.condition.toJSON(),
      event: this.eventOptions
    }
  }
}
