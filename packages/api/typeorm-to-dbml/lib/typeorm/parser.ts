import {
  ClassDeclaration,
  Decorator,
  ObjectLiteralExpression,
  PropertyAssignment,
  PropertyDeclaration
} from 'ts-morph'
import { getEntityName } from './entity.js'
import { toSnakeCase } from '#src/helpers/to-snake-case.js'
import { mapTypeToDbml } from '#src/dbml/mapper.js'

function getPropertyTypeName (property: PropertyDeclaration): string {
  const typeNode = property.getTypeNode()

  if (typeNode) {
    return typeNode.getText()
  }

  return property.getType().getText()
}

function hasDecorator (
  property: PropertyDeclaration,
  decoratorName: string
): boolean {
  return property.getDecorator(decoratorName) !== undefined
}

function getDecorator (
  property: PropertyDeclaration,
  decoratorName: string
): Decorator | undefined {
  return property.getDecorator(decoratorName)
}

function getDecoratorOptions (
  decorator: Decorator
): ObjectLiteralExpression | undefined {
  const args = decorator.getArguments()

  if (args.length > 0 && args[0] instanceof ObjectLiteralExpression) {
    return args[0]
  }

  return undefined
}

function getDecoratorProperty (
  decorator: Decorator,
  propertyName: string
): string | null {
  const options = getDecoratorOptions(decorator)

  if (options) {
    const property = options.getProperty(propertyName)

    if (property && property instanceof PropertyAssignment) {
      return property.getInitializer()?.getText().replace(/['"]/g, '') ?? null
    }
  }

  return null
}

function getColumnDefault (property: PropertyDeclaration): string | null {
  const columnDecorator = getDecorator(property, 'Column')

  if (!columnDecorator) {
    return null
  }

  const options = getDecoratorOptions(columnDecorator)

  if (options) {
    const defaultProperty = options.getProperty('default')

    if (defaultProperty && defaultProperty instanceof PropertyAssignment) {
      return defaultProperty.getInitializer()?.getText() ?? null
    }
  }

  return null
}

function isNullable (property: PropertyDeclaration): boolean {
  const columnDecorator = getDecorator(property, 'Column')

  if (!columnDecorator) {
    return false
  }

  const options = getDecoratorOptions(columnDecorator)

  if (options) {
    const nullableProperty = options.getProperty('nullable')

    if (nullableProperty && nullableProperty instanceof PropertyAssignment) {
      return nullableProperty.getInitializer()?.getText() === 'true'
    }
  }

  return false
}

function getJoinColumnName (property: PropertyDeclaration): string | null {
  const joinColumnDecorator = getDecorator(property, 'JoinColumn')

  if (!joinColumnDecorator) {
    return null
  }

  const options = getDecoratorOptions(joinColumnDecorator)

  if (options) {
    const nameProperty = options.getProperty('name')

    if (nameProperty && nameProperty instanceof PropertyAssignment) {
      return nameProperty.getInitializer()?.getText().replace(/['"]/g, '') ?? null
    }
  }

  return null
}

function getManyToOneTarget (property: PropertyDeclaration): string | null {
  const manyToOneDecorator = getDecorator(property, 'ManyToOne')

  if (!manyToOneDecorator) {
    return null
  }

  const args = manyToOneDecorator.getArguments()

  if (args.length > 0) {
    const targetArg = args[0].getText()
    // Matches: () => Entity, () => entities.Entity, () => module.Entity
    const match = targetArg.match(/=>\s*([\w.]+)/)

    if (match) {
      const fullName = match[1]
      const parts = fullName.split('.')

      return parts[parts.length - 1]
    }
  }

  return null
}

function getOneToOneTarget (property: PropertyDeclaration): string | null {
  const oneToOneDecorator = getDecorator(property, 'OneToOne')

  if (!oneToOneDecorator) {
    return null
  }

  const args = oneToOneDecorator.getArguments()

  if (args.length > 0) {
    const targetArg = args[0].getText()
    // Matches: () => Entity, () => entities.Entity, () => module.Entity
    const match = targetArg.match(/=>\s*([\w.]+)/)

    if (match) {
      const fullName = match[1]
      const parts = fullName.split('.')

      return parts[parts.length - 1]
    }
  }

  return null
}

export function processEntity (
  classDecl: ClassDeclaration,
  classToEntityMap: Map<string, string>
): { table: string, refs: string[] } {
  const entityName = getEntityName(classDecl)
  const properties = classDecl.getProperties()

  let tableDefinition = `Table ${entityName} {\n`
  const refs: string[] = []

  for (const property of properties) {
    const propertyName = toSnakeCase(property.getName())

    if (hasDecorator(property, 'PrimaryColumn')) {
      const decorator = property.getDecorator('PrimaryColumn')!
      const decoratorType = getDecoratorProperty(decorator, 'type')
      const propertyType = getPropertyTypeName(property)
      const dbmlType = decoratorType ?? mapTypeToDbml(propertyType)

      tableDefinition += `  ${propertyName} ${dbmlType} [pk]\n`

      continue
    }

    if (hasDecorator(property, 'PrimaryGeneratedColumn')) {
      const decorator = property.getDecorator('PrimaryGeneratedColumn')!
      const args = decorator.getArguments()

      if (args.length > 0 && args[0].getText() === '\'uuid\'') {
        tableDefinition += `  ${propertyName} varchar [pk]\n`
      } else {
        tableDefinition += `  ${propertyName} integer [pk, increment]\n`
      }
      continue
    }

    if (hasDecorator(property, 'Column')) {
      const decorator = property.getDecorator('Column')!
      const decoratorType = getDecoratorProperty(decorator, 'type')
      const propertyType = getPropertyTypeName(property)
      const dbmlType = decoratorType ?? mapTypeToDbml(propertyType)
      const nullable = isNullable(property)
      const defaultValue = getColumnDefault(property)

      const settings: string[] = []

      if (nullable) {
        settings.push('null')
      }
      if (defaultValue !== null) {
        settings.push(`default: '${defaultValue}'`)
      }

      const settingsStr
        = settings.length > 0 ? ` [${settings.join(', ')}]` : ''

      tableDefinition += `  ${propertyName} ${dbmlType}${settingsStr}\n`

      continue
    }

    if (hasDecorator(property, 'ManyToOne')) {
      const targetClassName = getManyToOneTarget(property)

      if (targetClassName !== null) {
        const fkColumnName
          = getJoinColumnName(property) ?? `${toSnakeCase(property.getName())}_id`
        const targetEntityName
          = classToEntityMap.get(targetClassName) ?? targetClassName

        refs.push(
          `Ref: ${entityName}.${fkColumnName} > ${targetEntityName}.uuid`
        )
      }
      continue
    }

    if (hasDecorator(property, 'OneToOne')) {
      const targetClassName = getOneToOneTarget(property)

      if (targetClassName !== null) {
        const fkColumnName
          = getJoinColumnName(property) ?? `${property.getName()}_id`
        const targetEntityName
          = classToEntityMap.get(targetClassName) ?? targetClassName

        refs.push(
          `Ref: ${entityName}.${fkColumnName} - ${targetEntityName}.uuid`
        )
      }
      continue
    }

    if (hasDecorator(property, 'CreateDateColumn')) {
      tableDefinition += `  ${propertyName} timestamp [default: 'now()']\n`

      continue
    }

    if (hasDecorator(property, 'UpdateDateColumn')) {
      tableDefinition += `  ${propertyName} timestamp [default: 'now()']\n`

      continue
    }

    if (hasDecorator(property, 'DeleteDateColumn')) {
      tableDefinition += `  ${propertyName} timestamp [null]\n`

      continue
    }
  }

  tableDefinition += `}\n`

  return { table: tableDefinition, refs }
}
