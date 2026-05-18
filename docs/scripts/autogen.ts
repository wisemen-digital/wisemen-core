import MarkdownIt from 'markdown-it'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ComponentMeta, MetaCheckerOptions, PropertyMetaSchema } from 'vue-component-meta'
import { createChecker } from 'vue-component-meta'

import {
  type DesignSystemComponentConfig,
  designSystemComponentGroups,
  designSystemComponents,
} from './designSystemComponents.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const md = new MarkdownIt()

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  printer: { newLine: 1 },
}

const designSystemChecker = createChecker(
  resolve(__dirname, '../../packages/web/design-system/tsconfig.app.json'),
  checkerOptions,
)

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function toStoryId(storyTitle: string): string {
  return `${storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}--default`
}

function parseTypeFromSchema(schema: PropertyMetaSchema): string {
  if (typeof schema === 'object' && (schema.kind === 'enum' || schema.kind === 'array')) {
    const isFlatEnum = schema.schema?.every((value) => typeof value === 'string')
    const enumValue = schema?.schema?.filter((value) => value !== 'undefined') ?? []

    if (isFlatEnum && /^[A-Z]/.test(schema.type))
      return enumValue.join(' | ')

    if (typeof schema.schema?.[0] === 'object' && schema.schema[0].kind === 'enum')
      return schema.schema.map((value: PropertyMetaSchema) => parseTypeFromSchema(value)).join(' | ')

    return schema.type
  }

  if (typeof schema === 'object' && schema.kind === 'object')
    return schema.type

  if (typeof schema === 'string')
    return schema

  return ''
}

type DesignSystemTableItem = {
  default?: string
  description: string
  name: string
  required?: boolean
  type: string
}

type DesignSystemMeta = {
  events: DesignSystemTableItem[]
  methods: DesignSystemTableItem[]
  props: DesignSystemTableItem[]
  slots: DesignSystemTableItem[]
}

function normalizeType(type: string): string {
  return type.replace(/\s*\|\s*undefined/g, '')
}

function renderDescription(description: string | undefined): string {
  return md.render(description ?? '')
}

function inferUpdateEventType(eventName: string, props: DesignSystemTableItem[], originalType: string): string {
  if (originalType !== 'unknown[]' || !eventName.startsWith('update:'))
    return normalizeType(originalType)

  const propName = eventName.replace('update:', '')
  const prop = props.find((currentProp) => currentProp.name === propName)

  if (prop === undefined)
    return normalizeType(originalType)

  return `[value: ${prop.type}]`
}

function parseDesignSystemMeta(meta: ComponentMeta): DesignSystemMeta {
  const props = meta.props
    .filter((prop) => !prop.global)
    .map((prop) => {
      let defaultValue = prop.default
      let type = prop.type
      const {
        description,
        name,
        required,
      } = prop

      if (defaultValue === 'undefined')
        defaultValue = undefined

      if (!type.includes('AcceptableValue'))
        type = parseTypeFromSchema(prop.schema) || type

      return {
        default: defaultValue ?? undefined,
        description: renderDescription(description),
        name,
        required,
        type: normalizeType(type),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const events = meta.events
    .map((event) => ({
      description: renderDescription(event.description),
      name: event.name,
      type: inferUpdateEventType(event.name, props, event.type),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const slots = meta.slots
    .map((slot) => {
      const type = parseTypeFromSchema(slot.schema) || normalizeType(slot.type) || '-'

      return {
        description: renderDescription(slot.description),
        name: slot.name,
        type: type === '{}' ? '-' : type,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const methods = meta.exposed
    .map((expose) => ({
      description: renderDescription(expose.description),
      name: expose.name,
      type: normalizeType(expose.type),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    events,
    methods,
    props,
    slots,
  }
}

function renderDesignSystemMeta(component: DesignSystemComponentConfig, meta: DesignSystemMeta): string {
  const scriptLines: string[] = []
  const returnedScriptNames: string[] = []
  const bodyLines: string[] = []

  if (component.styleFunctionName && component.styleImportPath) {
    scriptLines.push(`import { ${component.styleFunctionName} } from '${component.styleImportPath}'`)
    returnedScriptNames.push(component.styleFunctionName)
  }

  if (meta.props.length) {
    scriptLines.push(`const propsData = ${JSON.stringify(meta.props, null, 2)}`)
    returnedScriptNames.push('propsData')
  }

  if (meta.events.length) {
    scriptLines.push(`const eventsData = ${JSON.stringify(meta.events, null, 2)}`)
    returnedScriptNames.push('eventsData')
  }

  if (meta.slots.length) {
    scriptLines.push(`const slotsData = ${JSON.stringify(meta.slots, null, 2)}`)
    returnedScriptNames.push('slotsData')
  }

  if (meta.methods.length) {
    scriptLines.push(`const methodsData = ${JSON.stringify(meta.methods, null, 2)}`)
    returnedScriptNames.push('methodsData')
  }

  if (meta.props.length)
    bodyLines.push('<PropsTable :data="propsData" />')

  if (meta.events.length)
    bodyLines.push('<EmitsTable :data="eventsData" />')

  if (meta.slots.length)
    bodyLines.push('<SlotsTable :data="slotsData" />')

  if (meta.methods.length)
    bodyLines.push('<MethodsTable :data="methodsData" />')

  if (component.styleFunctionName)
    bodyLines.push(`<ClassConfig :style-function="${component.styleFunctionName}" />`)

  return [
    '<!-- This file was automatically generated. Do not edit it manually -->',
    scriptLines.length > 0
      ? `<script lang="ts">\n${scriptLines.join('\n\n')}\n\nexport default {\n  setup() {\n    return {\n${returnedScriptNames.map((name) => `      ${name},`).join('\n')}\n    }\n  },\n}\n</script>`
      : '',
    bodyLines.join('\n\n'),
    '',
  ].filter(Boolean).join('\n\n')
}

function renderDesignSystemPage(component: DesignSystemComponentConfig): string {
  const storybookUrl = `https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/${toStoryId(component.storyTitle)}`
  const previewTemplate = component.previewTemplate ?? '<Preview />'

  return [
    '<!-- This file was automatically generated. Do not edit it manually -->',
    '<script setup lang="ts">',
    `import Preview from '${component.previewPath}'`,
    component.previewSetup ?? '',
    '</script>',
    '',
    `# ${component.title}`,
    '',
    component.description,
    '',
    '<ClientOnly>',
    '  <DesignSystemPreview>',
    `    ${previewTemplate}`,
    '  </DesignSystemPreview>',
    '</ClientOnly>',
    '',
    `[Open in Storybook](${storybookUrl})`,
    '',
    '## API',
    '',
    `<!-- @include: ./${toKebabCase(component.componentName)}-meta.md -->`,
    '',
  ].join('\n')
}

function renderDesignSystemNavigation(): string {
  const groupLines = designSystemComponentGroups.map((group) => {
    const componentLines = group.components.map((component) => `        {
          text: '${component.title}',
          link: 'components/${component.targetFolder}/${toKebabCase(component.componentName)}',
        },`)

    return `    {
      text: '${group.name}',
      items: [
${componentLines.join('\n')}
      ],
    },`
  })

  return `import type { PackageDocNavigation } from '@docs/packages/navigation.utils'

export const DESIGN_SYSTEM_NAVIGATION: PackageDocNavigation = {
  link: 'pages/getting-started/installation',
  title: 'Design System',
  path: 'design-system',
  sidebar: [
    {
      text: 'Getting started',
      items: [
        {
          text: 'Installation',
          link: 'pages/getting-started/installation',
        },
      ],
    },
${groupLines.join('\n')}
  ],
}
`
}

for (const component of designSystemComponents) {
  const componentSourceFolder = resolve(__dirname, '../../packages/web/design-system/src/ui', component.sourceFolder)
  const meta = parseDesignSystemMeta(designSystemChecker.getComponentMeta(componentSourceFolder))
  const metaDirPath = resolve(__dirname, '../packages/design-system/components/', component.targetFolder)

  if (!existsSync(metaDirPath)) {
    mkdirSync(metaDirPath, {
      recursive: true,
    })
  }

  const metaMdFilePath = join(metaDirPath, `${toKebabCase(component.componentName)}-meta.md`)
  const componentMdFilePath = join(metaDirPath, `${toKebabCase(component.componentName)}.md`)

  writeFileSync(metaMdFilePath, renderDesignSystemMeta(component, meta))
  writeFileSync(componentMdFilePath, renderDesignSystemPage(component))
}

writeFileSync(
  resolve(__dirname, '../packages/design-system/designSystem.navigation.ts'),
  renderDesignSystemNavigation(),
)
