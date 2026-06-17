import fs from 'fs'
import { CallExpression, EnumDeclaration, Project, SyntaxKind, ts } from 'ts-morph'
import { getTranslationFile } from './translation.generator.js'
import { Builder } from '#src/builder/builder.js'
import { TranslationOptions } from '#src/type.js'
import { DomainEventResolverRegistry } from '#src/registry/domain-event.registry.js'

interface EventLogNode {
  [key: string]: EventLogNode | string | undefined
}

export function updateEventLogTranslations (
  builder: Builder,
  options: TranslationOptions
): void {
  builder.addManipulation((): string => {
    const domainEventTypeEnum = getDomainEventTypeEnum()
    const versionsForType = getVersionsForEnum(domainEventTypeEnum)

    for (const language of options.languages) {
      const filePath = getTranslationFile(language, 'event-log')
      const oldJSON = getJSONFromFile(filePath)

      const json = generateEventLogJSON(domainEventTypeEnum, oldJSON, versionsForType)
      const sortedJSON = sortEventLogJSON(json)

      fs.writeFileSync(filePath, JSON.stringify(sortedJSON, null, '\t'), 'utf-8')
    }

    return 'Updated event log translations'
  })
}

function generateEventLogJSON (
  eventLogEnum: EnumDeclaration,
  oldJSON: Record<string, EventLogNode>,
  versionsForType: Record<string, number[]>
): Record<string, EventLogNode> {
  const json: Record<string, EventLogNode> = {}

  for (const member of eventLogEnum.getMembers()) {
    const initializer = member.getInitializerOrThrow()
    const value = initializer.getText().replace(/^['"`](.*)['"`]$/, '$1')

    const segments = value.split('.')
    const primarySegment = segments[0]

    if (json[primarySegment] == undefined) {
      json[primarySegment] = {}
    }

    let current = json[primarySegment]
    let oldCurrent: EventLogNode | undefined = oldJSON[primarySegment]

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]

      if (typeof current[segment] !== 'object') {
        current[segment] = {}
      }

      current = current[segment]
      oldCurrent = oldCurrent?.[segment] as EventLogNode | undefined
    }

    const memberName = member.getName()
    const versions = versionsForType[memberName] ?? []

    for (const version of versions) {
      const versionKey = `v${version}`

      const existingValue = typeof oldCurrent?.[versionKey] === 'string'
        ? (oldCurrent[versionKey])
        : undefined

      current[versionKey] = existingValue ?? value
    }
  }

  return json
}

function sortEventLogJSON (json: Record<string, EventLogNode>): Record<string, EventLogNode> {
  const ordered: Record<string, EventLogNode> = {}
  const keys = Object.keys(json)

  for (const key of keys) {
    const value = json[key]

    if (typeof value === 'object') {
      ordered[key] = sortEventLogJSON(value as Record<string, EventLogNode>)
    } else {
      ordered[key] = value
    }
  }

  return ordered
}

function getDomainEventTypeEnum (): EnumDeclaration {
  const domainEventTypeEnum = DomainEventResolverRegistry.resolveImport('domainEventType')

  if (domainEventTypeEnum == null) {
    throw new Error('Domain event type enum not found')
  }

  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(domainEventTypeEnum.path)

  return sourceFile.getEnumOrThrow(domainEventTypeEnum.name)
}

function getJSONFromFile (filePath: string): Record<string, EventLogNode> {
  if (!fs.existsSync(filePath)) {
    return { }
  }

  const contents = fs.readFileSync(filePath, 'utf-8')

  if (contents.length === 0) {
    return { }
  }

  return JSON.parse(contents) as Record<string, EventLogNode>
}

function getVersionsForEnum (
  eventType: EnumDeclaration
): Record<string, number[]> {
  const versionsForEventTypes = getVersionsForEventTypes()
  const result: Record<string, number[]> = {}

  for (const member of eventType.getMembers()) {
    const memberName = member.getName()
    const initializerName = member.getInitializerOrThrow().getText().replaceAll('\'', '')

    const versions = versionsForEventTypes[memberName] ?? []

    result[initializerName] = versions
  }

  return versionsForEventTypes
}

function getVersionsForEventTypes (): Record<string, number[]> {
  const project = new Project()
  const sourceFiles = project.addSourceFilesAtPaths('src/**/*.event.ts')

  const result: Record<string, number[]> = {}

  for (const sourceFile of sourceFiles) {
    const decorators = sourceFile.getDescendantsOfKind(
      SyntaxKind.Decorator
    )

    for (const decorator of decorators) {
      const call = decorator.getExpressionIfKind(SyntaxKind.CallExpression)

      if (call == null) {
        continue
      }

      const data = parseTypeAndVersion(call)

      if (data == null) {
        continue
      }

      const versions = result[data.type] ?? []

      if (!versions.includes(data.version)) {
        versions.push(data.version)
        result[data.type] = versions
      }
    }
  }

  return result
}

function parseTypeAndVersion (
  call: CallExpression<ts.CallExpression>
): { type: string, version: number } | null {
  const identifier = call.getExpression().getText()

  if (identifier !== 'RegisterDomainEvent') {
    return null
  }

  const args = call.getArguments()

  if (args.length < 2) {
    return null
  }

  const type = args[0].getText().replace('DomainEventType.', '')
  const version = parseInt(args[1].getText(), 10)

  if (isNaN(version)) {
    return null
  }

  return { type, version }
}
