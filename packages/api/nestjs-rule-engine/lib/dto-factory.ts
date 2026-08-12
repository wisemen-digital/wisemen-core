import { plainToInstance, Transform, Type, type ClassConstructor } from 'class-transformer'
import {
  ApiExtraModels,
  ApiProperty,
  type ApiPropertyOptions,
  getSchemaPath
} from '@nestjs/swagger'
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsObject,
  IsOptional,
  ValidateNested
} from 'class-validator'
import type { DefaultValueTypes, ValueTypeRegistry } from '#src/value-types.js'

type DtoClass<T extends object = object> = ClassConstructor<T> & {
  prototype: T
  name: string
}

type OneOfSubType = {
  name: string
  value: DtoClass
}

type FactDefinition = {
  id: string
  nameKey?: string
  descriptionKey?: string
  valueType: PropertyKey
}

type OperatorDefinition = {
  id: string
  nameKey?: string
  descriptionKey?: string
  leftValueType: PropertyKey
  rightValueType?: PropertyKey
}

type EventDefinition = {
  id: string
  nameKey?: string
  descriptionKey?: string
  data: Record<string, PropertyKey>
}

type RuntimeValueDtos = {
  baseDto: DtoClass
  variantDtos: DtoClass[]
  subTypes: OneOfSubType[]
}

type EventCommandDtos = {
  baseDto: DtoClass
  eventDtos: DtoClass[]
  extraModels: DtoClass[]
  subTypes: OneOfSubType[]
}

type ConditionDtos = {
  baseDto: DtoClass
  allConditionDto: DtoClass
  anyConditionDto: DtoClass
  notConditionDto: DtoClass
  genericOperatorConditionDto: DtoClass
  operatorConditionDtos: DtoClass[]
  extraModels: DtoClass[]
  conditionDtos: DtoClass[]
  operatorConditionById: Map<string, DtoClass>
}

/**
 * DTO classes generated from an engine definition.
 */
export interface EngineDtos {
  /** Dto that can be used to represent the engine schema containing facts, events and operators */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  EngineSchemaDto: DtoClass

  /** Dto that can be used as the incoming request body for creating engine rules */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CreateRulesCommandDto: DtoClass
}

/**
 * Builds Swagger and validation DTOs from an engine definition.
 */
export class DtoFactory {
  /**
   * Builds DTO classes for schema inspection and rule creation payloads.
   */
  static buildDtos<TValueTypes extends DefaultValueTypes = DefaultValueTypes> (
    namePrefix: string,
    facts: FactDefinition[],
    operators: OperatorDefinition[],
    events: EventDefinition[],
    registry: ValueTypeRegistry<TValueTypes>
  ): EngineDtos {
    const factDtos = facts.map(f => this.buildFactDto(namePrefix, f))
    const operatorDtos = operators.map(o => this.buildOperatorSchemaDto(namePrefix, o))
    const eventDtos = events.map(e => this.buildEventSchemaDto(namePrefix, e))

    const factsByValueType = this.groupFactsByValueType(facts)
    const runtimeValueDtosByValueType = this.buildRuntimeValueDtosByValueType(
      namePrefix,
      factsByValueType,
      this.collectValueTypes(facts, operators, events),
      registry
    )
    const eventCommandDtos = this.buildEventCommandDtos(
      namePrefix,
      events,
      runtimeValueDtosByValueType
    )
    const conditionDtos = this.buildConditionDtos(
      namePrefix,
      operators,
      runtimeValueDtosByValueType
    )
    const ruleDto = this.buildRuleDto(namePrefix, conditionDtos, eventCommandDtos)

    return {
      EngineSchemaDto: this.buildEngineSchemaDto(namePrefix, factDtos, operatorDtos, eventDtos),
      CreateRulesCommandDto: this.buildCreateRulesCommandDto(
        namePrefix,
        ruleDto,
        [
          ruleDto,
          eventCommandDtos.baseDto,
          ...eventCommandDtos.extraModels,
          conditionDtos.baseDto,
          ...conditionDtos.extraModels,
          ...[...runtimeValueDtosByValueType.values()].flatMap(dto => [
            dto.baseDto,
            ...dto.variantDtos
          ])
        ]
      )
    }
  }

  private static buildCreateRulesCommandDto (
    namePrefix: string,
    ruleDto: DtoClass,
    extraModels: DtoClass[]
  ): DtoClass {
    @ApiExtraModels(...extraModels)
    class CreateRulesCommandDto {
      @ApiProperty({ type: ruleDto, isArray: true })
      @Type(() => ruleDto)
      @IsArray()
      @ValidateNested({ each: true })
      rules: object[]
    }

    this.withClassName(CreateRulesCommandDto, `${namePrefix}CreateRulesCommandDto`)
    return CreateRulesCommandDto
  }

  private static buildRuleDto (
    namePrefix: string,
    conditionDtos: ConditionDtos,
    eventCommandDtos: EventCommandDtos
  ): DtoClass {
    const RuleDto = this.withClassName(class { }, `${namePrefix}RuleDto`)

    this.decorateConditionProperty(
      RuleDto,
      'condition',
      conditionDtos,
      `${namePrefix}RuleCondition`
    )
    this.decorateDiscriminatedOneOfProperty(
      RuleDto,
      'event',
      eventCommandDtos.baseDto,
      eventCommandDtos.subTypes,
      `${namePrefix}RuleEvent`
    )

    return RuleDto
  }

  private static buildConditionDtos (
    namePrefix: string,
    operators: OperatorDefinition[],
    runtimeValueDtosByValueType: Map<string, RuntimeValueDtos>
  ): ConditionDtos {
    const BaseConditionDto = this.withClassName(class { }, `${namePrefix}ConditionDto`)
    const AllConditionDto = this.withClassName(class { }, `${namePrefix}AllConditionDto`)
    const AnyConditionDto = this.withClassName(class { }, `${namePrefix}AnyConditionDto`)
    const NotConditionDto = this.withClassName(class { }, `${namePrefix}NotConditionDto`)
    const GenericOperatorConditionDto = this.withClassName(
      class { },
      `${namePrefix}OperatorConditionDto`
    )

    const operatorConditionById = new Map<string, DtoClass>()
    const operatorConditionDtos = operators.map(operator => {
      const OperatorConditionDto = this.buildOperatorConditionDto(
        namePrefix,
        operator,
        runtimeValueDtosByValueType
      )
      operatorConditionById.set(operator.id, OperatorConditionDto)
      return OperatorConditionDto
    })

    const conditionDtos = [
      AllConditionDto,
      AnyConditionDto,
      NotConditionDto,
      ...operatorConditionDtos
    ]
    const genericRuntimeValueDtos = this.buildGenericRuntimeValueDtos(
      namePrefix,
      runtimeValueDtosByValueType
    )

    this.setEnumProperty(
      AllConditionDto,
      'type',
      ['all'],
      `${namePrefix}AllConditionType`
    )
    this.decorateConditionProperty(
      AllConditionDto,
      'conditions',
      {
        baseDto: BaseConditionDto,
        allConditionDto: AllConditionDto,
        anyConditionDto: AnyConditionDto,
        notConditionDto: NotConditionDto,
        genericOperatorConditionDto: GenericOperatorConditionDto,
        operatorConditionDtos,
        extraModels: [],
        conditionDtos,
        operatorConditionById
      },
      `${namePrefix}AllConditions`,
      true
    )

    this.setEnumProperty(
      AnyConditionDto,
      'type',
      ['any'],
      `${namePrefix}AnyConditionType`
    )
    this.decorateConditionProperty(
      AnyConditionDto,
      'conditions',
      {
        baseDto: BaseConditionDto,
        allConditionDto: AllConditionDto,
        anyConditionDto: AnyConditionDto,
        notConditionDto: NotConditionDto,
        genericOperatorConditionDto: GenericOperatorConditionDto,
        operatorConditionDtos,
        extraModels: [],
        conditionDtos,
        operatorConditionById
      },
      `${namePrefix}AnyConditions`,
      true
    )

    this.setEnumProperty(
      NotConditionDto,
      'type',
      ['not'],
      `${namePrefix}NotConditionType`
    )
    this.decorateConditionProperty(
      NotConditionDto,
      'condition',
      {
        baseDto: BaseConditionDto,
        allConditionDto: AllConditionDto,
        anyConditionDto: AnyConditionDto,
        notConditionDto: NotConditionDto,
        genericOperatorConditionDto: GenericOperatorConditionDto,
        operatorConditionDtos,
        extraModels: [],
        conditionDtos,
        operatorConditionById
      },
      `${namePrefix}NotCondition`
    )

    this.setEnumProperty(
      GenericOperatorConditionDto,
      'type',
      ['operator'],
      `${namePrefix}OperatorConditionType`
    )
    this.setEnumProperty(
      GenericOperatorConditionDto,
      'operatorId',
      operators.map(operator => operator.id),
      `${namePrefix}OperatorId`
    )
    this.decorateDiscriminatedOneOfProperty(
      GenericOperatorConditionDto,
      'leftValue',
      genericRuntimeValueDtos.baseDto,
      genericRuntimeValueDtos.subTypes,
      `${namePrefix}GenericOperatorLeftValue`
    )
    this.decorateDiscriminatedOneOfProperty(
      GenericOperatorConditionDto,
      'rightValue',
      genericRuntimeValueDtos.baseDto,
      genericRuntimeValueDtos.subTypes,
      `${namePrefix}GenericOperatorRightValue`,
      { required: false }
    )
    IsOptional()(GenericOperatorConditionDto.prototype, 'rightValue')

    return {
      baseDto: BaseConditionDto,
      allConditionDto: AllConditionDto,
      anyConditionDto: AnyConditionDto,
      notConditionDto: NotConditionDto,
      genericOperatorConditionDto: GenericOperatorConditionDto,
      operatorConditionDtos,
      extraModels: [
        AllConditionDto,
        AnyConditionDto,
        NotConditionDto,
        GenericOperatorConditionDto,
        ...operatorConditionDtos,
        genericRuntimeValueDtos.baseDto,
        ...genericRuntimeValueDtos.variantDtos
      ],
      conditionDtos,
      operatorConditionById
    }
  }

  private static buildOperatorConditionDto (
    namePrefix: string,
    operator: OperatorDefinition,
    runtimeValueDtosByValueType: Map<string, RuntimeValueDtos>
  ): DtoClass {
    const classNameBase = `${namePrefix}${this.toPascalCase(operator.id)}OperatorCondition`
    const OperatorConditionDto = this.withClassName(class { }, `${classNameBase}Dto`)
    const leftValueDtos = this.getRuntimeValueDtosForType(
      runtimeValueDtosByValueType,
      operator.leftValueType
    )

    this.setEnumProperty(
      OperatorConditionDto,
      'type',
      ['operator'],
      `${classNameBase}Type`
    )
    this.setEnumProperty(
      OperatorConditionDto,
      'operatorId',
      [operator.id],
      `${classNameBase}OperatorId`
    )
    this.decorateDiscriminatedOneOfProperty(
      OperatorConditionDto,
      'leftValue',
      leftValueDtos.baseDto,
      leftValueDtos.subTypes,
      `${classNameBase}LeftValue`
    )

    if (operator.rightValueType === undefined) {
      return OperatorConditionDto
    }

    const rightValueDtos = this.getRuntimeValueDtosForType(
      runtimeValueDtosByValueType,
      operator.rightValueType
    )
    this.decorateDiscriminatedOneOfProperty(
      OperatorConditionDto,
      'rightValue',
      rightValueDtos.baseDto,
      rightValueDtos.subTypes,
      `${classNameBase}RightValue`
    )

    return OperatorConditionDto
  }

  private static buildEventCommandDtos (
    namePrefix: string,
    events: EventDefinition[],
    runtimeValueDtosByValueType: Map<string, RuntimeValueDtos>
  ): EventCommandDtos {
    const BaseEventDto = this.withClassName(class { }, `${namePrefix}RuleEventDto`)
    this.setEnumProperty(
      BaseEventDto,
      'id',
      events.map(event => event.id),
      `${namePrefix}RuleEventId`
    )
    ApiProperty({ type: 'object', additionalProperties: true })(BaseEventDto.prototype, 'data')
    IsObject()(BaseEventDto.prototype, 'data')

    const extraModels: DtoClass[] = []
    const eventDtos = events.map(event => {
      const classNameBase = `${namePrefix}${this.toPascalCase(event.id)}RuleEvent`
      const EventDataDto = this.withClassName(class { }, `${classNameBase}DataDto`)
      const EventDto = this.withClassName(class { }, `${classNameBase}Dto`)

      for (const [key, valueType] of Object.entries(event.data)) {
        const runtimeValueDtos = this.getRuntimeValueDtosForType(
          runtimeValueDtosByValueType,
          valueType
        )

        this.decorateDiscriminatedOneOfProperty(
          EventDataDto,
          key,
          runtimeValueDtos.baseDto,
          runtimeValueDtos.subTypes,
          `${classNameBase}${this.toPascalCase(key)}`
        )
      }

      this.setEnumProperty(EventDto, 'id', [event.id], `${classNameBase}Id`)
      ApiProperty({ type: EventDataDto })(EventDto.prototype, 'data')
      Type(() => EventDataDto)(EventDto.prototype, 'data')
      ValidateNested()(EventDto.prototype, 'data')

      extraModels.push(EventDataDto, EventDto)
      return EventDto
    })

    return {
      baseDto: BaseEventDto,
      eventDtos,
      extraModels,
      subTypes: events.map((event, index) => ({
        name: event.id,
        value: eventDtos[index]
      }))
    }
  }

  private static buildRuntimeValueDtosByValueType<TValueTypes extends DefaultValueTypes> (
    namePrefix: string,
    factsByValueType: Map<string, FactDefinition[]>,
    valueTypes: string[],
    registry: ValueTypeRegistry<TValueTypes>
  ): Map<string, RuntimeValueDtos> {
    return new Map(
      valueTypes.map(valueType => [
        valueType,
        this.buildRuntimeValueDtos(
          namePrefix,
          valueType,
          factsByValueType.get(valueType) ?? [],
          registry
        )
      ])
    )
  }

  private static buildRuntimeValueDtos<TValueTypes extends DefaultValueTypes> (
    namePrefix: string,
    valueType: string,
    facts: FactDefinition[],
    registry: ValueTypeRegistry<TValueTypes>
  ): RuntimeValueDtos {
    const classNameBase = `${namePrefix}${this.toPascalCase(valueType)}RuntimeValue`
    const BaseRuntimeValueDto = this.withClassName(class { }, `${classNameBase}Dto`)
    this.setEnumProperty(BaseRuntimeValueDto, 'type', ['fact', 'value'], `${classNameBase}Type`)

    const variantDtos: DtoClass[] = []
    const subTypes: OneOfSubType[] = []

    if (facts.length > 0) {
      const FactRuntimeValueDto = this.withClassName(class { }, `${classNameBase}FactReferenceDto`)
      this.setEnumProperty(FactRuntimeValueDto, 'type', ['fact'], `${classNameBase}FactReferenceType`)
      this.setEnumProperty(FactRuntimeValueDto, 'factId', facts.map(fact => fact.id), `${classNameBase}FactId`)

      variantDtos.push(FactRuntimeValueDto)
      subTypes.push({ name: 'fact', value: FactRuntimeValueDto })
    }

    const InputRuntimeValueDto = this.withClassName(class { }, `${classNameBase}InputDto`)
    this.setEnumProperty(InputRuntimeValueDto, 'type', ['value'], `${classNameBase}InputType`)
    this.decorateRuntimeInputValueProperty(
      InputRuntimeValueDto,
      'value',
      valueType,
      classNameBase,
      registry
    )
    variantDtos.push(InputRuntimeValueDto)
    subTypes.push({ name: 'value', value: InputRuntimeValueDto })

    return {
      baseDto: BaseRuntimeValueDto,
      variantDtos,
      subTypes
    }
  }

  private static buildGenericRuntimeValueDtos (
    namePrefix: string,
    runtimeValueDtosByValueType: Map<string, RuntimeValueDtos>
  ): RuntimeValueDtos {
    const classNameBase = `${namePrefix}GenericRuntimeValue`
    const BaseRuntimeValueDto = this.withClassName(class { }, `${classNameBase}Dto`)
    const variantDtos = [...runtimeValueDtosByValueType.values()].flatMap(dto => dto.variantDtos)
    const subTypes = variantDtos.map(dto => ({ name: this.getDiscriminatorValue(dto, 'type'), value: dto }))
    this.setEnumProperty(BaseRuntimeValueDto, 'type', ['fact', 'value'], `${classNameBase}Type`)

    return {
      baseDto: BaseRuntimeValueDto,
      variantDtos,
      subTypes
    }
  }

  private static buildEngineSchemaDto (
    namePrefix: string,
    factDtos: DtoClass[],
    operatorDtos: DtoClass[],
    eventDtos: DtoClass[]
  ): DtoClass {
    @ApiExtraModels(...factDtos, ...operatorDtos, ...eventDtos)
    class EngineSchemaDto {
      @ApiProperty({ type: 'array', items: { oneOf: factDtos.map(f => ({ $ref: getSchemaPath(f) })) } })
      facts: DtoClass[]

      @ApiProperty({ type: 'array', items: { oneOf: operatorDtos.map(o => ({ $ref: getSchemaPath(o) })) } })
      operators: DtoClass[]

      @ApiProperty({ type: 'array', items: { oneOf: eventDtos.map(eventDto => ({ $ref: getSchemaPath(eventDto) })) } })
      events: DtoClass[]
    }

    this.withClassName(EngineSchemaDto, `${namePrefix}EngineSchemaDto`)
    return EngineSchemaDto
  }

  private static buildFactDto (namePrefix: string, fact: FactDefinition): DtoClass {
    const classNameBase = `${namePrefix}${this.toPascalCase(fact.id)}Fact`
    const FactDto = this.withClassName(class { }, `${classNameBase}Dto`)

    this.setEnumProperty(FactDto, 'id', [fact.id], `${classNameBase}Id`)
    this.setOptionalStringProperty(FactDto, 'name', fact.nameKey, `${classNameBase}Name`)
    this.setOptionalStringProperty(FactDto, 'description', fact.descriptionKey, `${classNameBase}Description`)
    this.setEnumProperty(FactDto, 'valueType', [String(fact.valueType)], `${classNameBase}ValueType`)

    return FactDto
  }

  private static buildOperatorSchemaDto (
    namePrefix: string,
    operator: OperatorDefinition
  ): DtoClass {
    const classNameBase = `${namePrefix}${this.toPascalCase(operator.id)}Operator`
    const OperatorDto = this.withClassName(class { }, `${classNameBase}Dto`)

    this.setEnumProperty(OperatorDto, 'id', [operator.id], `${classNameBase}Id`)
    this.setOptionalStringProperty(OperatorDto, 'name', operator.nameKey, `${classNameBase}Name`)
    this.setOptionalStringProperty(OperatorDto, 'description', operator.descriptionKey, `${classNameBase}Description`)
    this.setEnumProperty(OperatorDto, 'leftValueType', [String(operator.leftValueType)], `${classNameBase}LeftValueType`)

    if (operator.rightValueType !== undefined) {
      this.setEnumProperty(OperatorDto, 'rightValueType', [String(operator.rightValueType)], `${classNameBase}RightValueType`, { required: false })
      IsOptional()(OperatorDto.prototype, 'rightValueType')
    }

    return OperatorDto
  }

  private static buildEventSchemaDto (namePrefix: string, event: EventDefinition): DtoClass {
    const classNameBase = `${namePrefix}${this.toPascalCase(event.id)}Event`
    const EventDataDto = this.buildEventSchemaDataDto(classNameBase, event)
    const EventDto = this.withClassName(class { }, `${classNameBase}Dto`)

    this.setEnumProperty(EventDto, 'id', [event.id], `${classNameBase}Id`)
    this.setOptionalStringProperty(EventDto, 'name', event.nameKey, `${classNameBase}Name`)
    this.setOptionalStringProperty(
      EventDto,
      'description',
      event.descriptionKey,
      `${classNameBase}Description`
    )
    ApiProperty({ type: EventDataDto })(EventDto.prototype, 'data')

    return EventDto
  }

  private static buildEventSchemaDataDto (
    classNameBase: string,
    event: EventDefinition
  ): DtoClass {
    const EventDataDto = this.withClassName(class { }, `${classNameBase}DataDto`)

    for (const [key, valueType] of Object.entries(event.data)) {
      this.setEnumProperty(
        EventDataDto,
        key,
        [String(valueType)],
        `${classNameBase}${this.toPascalCase(key)}ValueType`
      )
    }

    return EventDataDto
  }

  private static decorateConditionProperty (
    dtoClass: DtoClass,
    propertyKey: string,
    conditionDtos: ConditionDtos,
    schemaName: string,
    isArray = false
  ): void {
    this.setOneOfApiProperty(
      dtoClass,
      propertyKey,
      conditionDtos.conditionDtos,
      schemaName,
      undefined,
      isArray
    )
    if (isArray) {
      IsArray()(dtoClass.prototype, propertyKey)
    }
    Transform(
      ({ value }) => this.transformConditionValue(value, conditionDtos, isArray),
      { toClassOnly: true }
    )(dtoClass.prototype, propertyKey)
    ValidateNested({ each: isArray })(dtoClass.prototype, propertyKey)
  }

  private static transformConditionValue (
    value: unknown,
    conditionDtos: ConditionDtos,
    isArray: boolean
  ): unknown {
    if (value === null || value === undefined) {
      return value
    }

    if (isArray) {
      if (!Array.isArray(value)) {
        return value
      }

      return value.map(item => this.transformConditionValue(item, conditionDtos, false))
    }

    if (!this.isRecord(value)) {
      return value
    }

    const dtoClass = this.getConditionDtoClass(value, conditionDtos)
    return plainToInstance(dtoClass, value)
  }

  private static getConditionDtoClass (
    value: Record<string, unknown>,
    conditionDtos: ConditionDtos
  ): DtoClass {
    switch (value.type) {
      case 'all':
        return conditionDtos.allConditionDto
      case 'any':
        return conditionDtos.anyConditionDto
      case 'not':
        return conditionDtos.notConditionDto
      case 'operator':
        if (typeof value.operatorId !== 'string') {
          return conditionDtos.genericOperatorConditionDto
        }

        return (
          conditionDtos.operatorConditionById.get(value.operatorId)
          ?? conditionDtos.genericOperatorConditionDto
        )
      default:
        return conditionDtos.baseDto
    }
  }

  private static decorateDiscriminatedOneOfProperty (
    dtoClass: DtoClass,
    propertyKey: string,
    baseDto: DtoClass,
    subTypes: OneOfSubType[],
    schemaName: string,
    options?: ApiPropertyOptions
  ): void {
    this.setOneOfApiProperty(dtoClass, propertyKey, subTypes.map(type => type.value), schemaName, {
      propertyName: this.getDiscriminatorPropertyName(subTypes),
      mapping: this.getSchemaPathMapping(subTypes)
    }, false, options)
    if (options?.required !== false) {
      IsDefined()(dtoClass.prototype, propertyKey)
    }
    Type(() => baseDto, {
      discriminator: {
        property: this.getDiscriminatorPropertyName(subTypes),
        subTypes
      },
      keepDiscriminatorProperty: true
    })(dtoClass.prototype, propertyKey)
    ValidateNested()(dtoClass.prototype, propertyKey)
  }

  private static setOneOfApiProperty (
    dtoClass: DtoClass,
    propertyKey: string,
    oneOfDtos: DtoClass[],
    schemaName: string,
    discriminator?: { propertyName: string, mapping: Record<string, string> },
    isArray = false,
    options?: ApiPropertyOptions
  ): void {
    const references = oneOfDtos.map(dto => ({ $ref: getSchemaPath(dto) }))
    const schema = {
      oneOf: references,
      ...(discriminator === undefined ? {} : { discriminator })
    }
    const apiPropertyOptions = (
      isArray
        ? {
          ...options,
          type: 'array' as const,
          items: schema,
          title: options?.title ?? schemaName
        }
        : {
          ...options,
          type: Object,
          ...schema,
          title: options?.title ?? schemaName
        }
    ) as ApiPropertyOptions

    ApiProperty(apiPropertyOptions)(dtoClass.prototype, propertyKey)
  }

  private static getDiscriminatorPropertyName (subTypes: OneOfSubType[]): string {
    return this.hasDiscriminatorProperty(subTypes, 'id') ? 'id' : 'type'
  }

  private static hasDiscriminatorProperty (
    subTypes: OneOfSubType[],
    propertyKey: string
  ): boolean {
    return subTypes.every(subType =>
      Reflect.hasMetadata('swagger/apiModelProperties', subType.value.prototype)
      || propertyKey in subType.value.prototype
      || this.getDiscriminatorValue(subType.value, propertyKey) !== undefined
    )
  }

  private static getSchemaPathMapping (subTypes: OneOfSubType[]): Record<string, string> {
    return Object.fromEntries(
      subTypes.map(subType => [subType.name, getSchemaPath(subType.value)])
    )
  }

  private static getDiscriminatorValue (
    dtoClass: DtoClass,
    propertyKey: string
  ): string {
    const properties = Reflect.getMetadata('swagger/apiModelProperties', dtoClass.prototype) as
      | Record<string, { enum?: unknown[] }>
      | undefined
    const property = properties?.[propertyKey]
    const [value] = property?.enum ?? []

    return String(value)
  }

  private static decorateRuntimeInputValueProperty<TValueTypes extends DefaultValueTypes> (
    dtoClass: DtoClass,
    propertyKey: string,
    valueType: string,
    classNameBase: string,
    registry: ValueTypeRegistry<TValueTypes>
  ): void {
    const decorators = registry.getDtoDecorators(valueType as keyof TValueTypes)

    if (decorators.length === 0) {
      ApiProperty({
        description: `Literal runtime value for "${valueType}"`,
        title: `${classNameBase}Value`
      })(dtoClass.prototype, propertyKey)
      IsDefined()(dtoClass.prototype, propertyKey)
      return
    }

    this.applyPropertyDecorators(dtoClass, propertyKey, decorators)
  }

  private static setEnumProperty (
    dtoClass: DtoClass,
    propertyKey: string,
    values: string[],
    enumName: string,
    options?: ApiPropertyOptions
  ): void {
    ApiProperty({ ...options, enum: values, enumName })(dtoClass.prototype, propertyKey)
    IsDefined()(dtoClass.prototype, propertyKey)
    IsEnum(values)(dtoClass.prototype, propertyKey)
  }

  private static setOptionalStringProperty (
    dtoClass: DtoClass,
    propertyKey: string,
    value: string | undefined,
    enumName: string
  ): void {
    if (value === undefined) {
      return
    }

    this.setEnumProperty(dtoClass, propertyKey, [value], enumName, {
      required: false
    })
    IsOptional()(dtoClass.prototype, propertyKey)
  }

  private static groupFactsByValueType (
    facts: FactDefinition[]
  ): Map<string, FactDefinition[]> {
    const factsByValueType = new Map<string, FactDefinition[]>()

    for (const fact of facts) {
      const valueType = String(fact.valueType)
      const currentFacts = factsByValueType.get(valueType) ?? []
      currentFacts.push(fact)
      factsByValueType.set(valueType, currentFacts)
    }

    return factsByValueType
  }

  private static collectValueTypes (
    facts: FactDefinition[],
    operators: OperatorDefinition[],
    events: EventDefinition[]
  ): string[] {
    const valueTypes = new Set<string>()

    for (const fact of facts) {
      valueTypes.add(String(fact.valueType))
    }

    for (const operator of operators) {
      valueTypes.add(String(operator.leftValueType))
      if (operator.rightValueType !== undefined) {
        valueTypes.add(String(operator.rightValueType))
      }
    }

    for (const event of events) {
      for (const valueType of Object.values(event.data)) {
        valueTypes.add(String(valueType))
      }
    }

    return [...valueTypes]
  }

  private static getRuntimeValueDtosForType (
    runtimeValueDtosByValueType: Map<string, RuntimeValueDtos>,
    valueType: PropertyKey
  ): RuntimeValueDtos {
    const runtimeValueDtos = runtimeValueDtosByValueType.get(String(valueType))

    if (runtimeValueDtos === undefined) {
      throw new Error(`runtime value dto for type "${String(valueType)}" was not found`)
    }

    return runtimeValueDtos
  }

  private static isRecord (value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
  }

  private static applyPropertyDecorators (
    dtoClass: DtoClass,
    propertyKey: string,
    decorators: PropertyDecorator[]
  ): void {
    for (const decorator of decorators) {
      decorator(dtoClass.prototype, propertyKey)
    }
  }

  private static withClassName<TClass extends DtoClass> (
    value: TClass,
    name: string
  ): TClass {
    Object.defineProperty(value, 'name', { value: name })
    return value
  }

  private static toPascalCase (value: string): string {
    return value
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  }
}
