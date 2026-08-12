import { Almanac } from '#src/almanac.js'
import { DEFAULT_OPERATORS } from '#src/default-operators.js'
import { DtoFactory, type EngineDtos } from '#src/dto-factory.js'
import type { EventDataDefinition, Event } from '#src/event.js'
import type { Fact } from '#src/fact.js'
import type { AnyOperator } from '#src/operator.js'
import { Rule, type RuleEvent, type RuleOptions } from '#src/rule.js'
import type { RuntimeFacts } from '#src/runtime-fact.js'
import { DEFAULT_VALUE_TYPE_REGISTRY, type DefaultValueTypes, type ValueTypeRegistry } from '#src/value-types.js'

/**
 * Configures the rule engine facts, operators, events, and value registry.
 */
export interface EngineOptions<
  TI18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes,
  TFacts extends readonly Fact<string, TI18nPath, TValueTypes>[] = readonly Fact<string, TI18nPath, TValueTypes>[],
  TEvents extends readonly Event<
    string,
    TI18nPath,
    TValueTypes,
    EventDataDefinition<TValueTypes>
  >[] = readonly Event<
    string,
    TI18nPath,
    TValueTypes,
    EventDataDefinition<TValueTypes>
  >[]
> {
  facts: TFacts

  operators?: readonly AnyOperator<TI18nPath, TValueTypes>[]

  events: TEvents

  registry?: ValueTypeRegistry<TValueTypes>
}

/**
 * Evaluates typed rules against runtime facts and emits typed events.
 */
export class Engine<
  TI18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes,
  const TFacts extends readonly Fact<string, TI18nPath, TValueTypes>[] = readonly Fact<string, TI18nPath, TValueTypes>[],
  const TEvents extends readonly Event<
    string,
    TI18nPath,
    TValueTypes,
    EventDataDefinition<TValueTypes>
  >[] = readonly Event<
    string,
    TI18nPath,
    TValueTypes,
    EventDataDefinition<TValueTypes>
  >[],
>{
  readonly facts: Map<TFacts[number]['id'], TFacts[number]>
  readonly operators: Map<string, AnyOperator<TI18nPath, TValueTypes>>
  readonly events: Map<TEvents[number]['id'], TEvents[number]>
  readonly registry: ValueTypeRegistry<TValueTypes>

  constructor (options: EngineOptions<
    TI18nPath,
    TValueTypes,
    TFacts,
    TEvents
  >) {
    this.facts = new Map(options.facts.map(f => [f.id, f]))
    const operators = options.operators
      ?? (DEFAULT_OPERATORS as unknown as readonly AnyOperator<TI18nPath, TValueTypes>[])
    this.operators = new Map<string, AnyOperator<TI18nPath, TValueTypes>>(
      operators.map(operator => [operator.id, operator] as const)
    )
    this.events = new Map<TEvents[number]['id'], TEvents[number]>(
      options.events.map(e => [e.id, e])
    )
    this.registry = options.registry ?? (DEFAULT_VALUE_TYPE_REGISTRY as unknown as ValueTypeRegistry<TValueTypes>)
  }

  /**
   * Create swagger decorated Dtos based on the engines facts, operators and events 
   * @param namePrefix a prefix added to the front of the class name, e.g. `GifCardDiscount`
   */
  createDtos (namePrefix = ''): EngineDtos {
    return DtoFactory.buildDtos(
      namePrefix,
      [...this.facts.values()],
      [...this.operators.values()],
      [...this.events.values()],
      this.registry
    )
  }

  /**
   * Evaluates a set of rules against runtime facts and returns the emitted events.
   */
  run (
    runtimeFacts: RuntimeFacts<TFacts, TValueTypes>,
    rules: RuleOptions[]
  ): RuleEvent<TValueTypes, TEvents[number]>[] {
    const almanac = new Almanac<TValueTypes>(this.registry, this.facts, runtimeFacts)
    const events: RuleEvent<TValueTypes, TEvents[number]>[] = []

    for (const rule of rules) {
      const ruleResult = new Rule<TValueTypes>(rule).evaluate(almanac, this.operators, this.events)
      if (ruleResult !== null) {
        events.push(ruleResult)
      }
    }

    return events
  }
}
