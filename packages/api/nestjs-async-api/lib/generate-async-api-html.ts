import YAML from 'yaml'
import type {
  AsyncAPIDocument,
  AsyncAPIMessage,
  AsyncAPIOperation
} from './async-api.types.js'

type UnknownRecord = Record<string, unknown>

type ChannelLookup = {
  name: string
  description?: string
  address?: string
  messageNames: string[]
  schemaNames: string[]
  operationNames: string[]
}

type OperationLookup = {
  name: string
  channelName?: string
  action?: string
  summary?: string
  description?: string
  messageNames: string[]
}

type MessageLookup = {
  name: string
  message?: AsyncAPIMessage
  schemaName?: string
}

type SchemaEntries = Record<string, unknown>

function isRecord (value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function escapeHTML (value: unknown): string {
  let normalized = ''

  if (value === null || value === undefined) {
    normalized = ''
  } else if (typeof value === 'string') {
    normalized = value
  } else if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    normalized = `${value}`
  } else {
    normalized = JSON.stringify(value) ?? ''
  }

  return normalized
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')
}

function valueToCodeBlock (value: unknown): string {
  if (value === undefined) {
    return '<p class="muted">No data available.</p>'
  }

  const formatted = typeof value === 'string'
    ? value
    : JSON.stringify(value, null, 2) ?? 'No serializable data available.'

  return `<pre>${escapeHTML(formatted)}</pre>`
}

function parseAsyncApiDocument (yaml: string): AsyncAPIDocument {
  const parsedDocument: unknown = YAML.parse(yaml)

  if (!isRecord(parsedDocument)) {
    throw new Error('Invalid AsyncAPI document: YAML did not parse to an object')
  }

  if (typeof parsedDocument.asyncapi !== 'string') {
    throw new Error('Invalid AsyncAPI document: asyncapi must be a string')
  }

  if (!isRecord(parsedDocument.info)) {
    throw new Error('Invalid AsyncAPI document: info must be an object')
  }

  if (typeof parsedDocument.info.title !== 'string' || typeof parsedDocument.info.version !== 'string') {
    throw new Error('Invalid AsyncAPI document: info.title and info.version are required')
  }

  if (!isRecord(parsedDocument.channels)) {
    throw new Error('Invalid AsyncAPI document: channels must be an object')
  }

  return parsedDocument as AsyncAPIDocument
}

function toAnchorId (prefix: string, name: string): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${prefix}-${normalized || 'item'}`
}

function resolveChannelNameFromRef (ref: string): string | undefined {
  if (!ref.startsWith('#/channels/')) {
    return undefined
  }

  return ref.replace('#/channels/', '')
}

function resolveMessageNameFromChannelRef (ref: string): string | undefined {
  if (!ref.startsWith('#/channels/')) {
    return undefined
  }

  const segments = ref.split('/')
  const messageName = segments[segments.length - 1]

  return messageName || undefined
}

function resolveMessageNameFromComponentRef (ref: string): string | undefined {
  if (!ref.startsWith('#/components/messages/')) {
    return undefined
  }

  return ref.replace('#/components/messages/', '')
}

function resolveSchemaNameFromRef (ref: string): string | undefined {
  if (!ref.startsWith('#/components/schemas/')) {
    return undefined
  }

  return ref.replace('#/components/schemas/', '')
}

function collectOperationMessages (operation: AsyncAPIOperation): string[] {
  if (operation.messages === undefined) {
    return []
  }

  return operation.messages
    .map(messageRef => resolveMessageNameFromChannelRef(messageRef.$ref))
    .filter((messageName): messageName is string => messageName !== undefined)
}

function buildLookups (document: AsyncAPIDocument) {
  const operations = document.operations ?? {}
  const messages = document.components?.messages ?? {}
  const schemas = document.components?.schemas ?? {}

  const operationsByChannel = new Map<string, string[]>()
  const operationLookups: OperationLookup[] = []

  for (const [operationName, operation] of Object.entries(operations)) {
    const channelName = resolveChannelNameFromRef(operation.channel.$ref)
    const operationMessages = collectOperationMessages(operation)

    operationLookups.push({
      name: operationName,
      channelName,
      action: operation.action,
      summary: operation.summary,
      description: operation.description,
      messageNames: operationMessages
    })

    if (channelName !== undefined) {
      const channelOperations = operationsByChannel.get(channelName) ?? []

      channelOperations.push(operationName)

      operationsByChannel.set(channelName, channelOperations)
    }
  }

  const messageLookups: Record<string, MessageLookup> = {}

  for (const [messageName, messageValue] of Object.entries(messages)) {
    const payloadRef = typeof messageValue.payload === 'object'
      && messageValue.payload !== null
      && '$ref' in messageValue.payload
      ? String(messageValue.payload.$ref)
      : undefined

    const schemaName = payloadRef !== undefined
      ? resolveSchemaNameFromRef(payloadRef)
      : undefined

    messageLookups[messageName] = {
      name: messageName,
      message: messageValue,
      schemaName
    }
  }

  const channelLookups: ChannelLookup[] = []

  for (const [channelName, channelValue] of Object.entries(document.channels)) {
    const channel = channelValue
    const channelMessageNames = new Set<string>()

    if (channel.messages !== undefined) {
      for (const [messageName, messageRef] of Object.entries(channel.messages)) {
        channelMessageNames.add(messageName)

        const componentMessageName = resolveMessageNameFromComponentRef(messageRef.$ref)

        if (componentMessageName !== undefined) {
          channelMessageNames.add(componentMessageName)
        }
      }
    }

    const operationNames = operationsByChannel.get(channelName) ?? []
    const operationMessages = operationNames
      .map(operationName => collectOperationMessages(operations[operationName]))
      .flat()

    for (const operationMessage of operationMessages) {
      channelMessageNames.add(operationMessage)
    }

    const schemaNames = new Set<string>()

    for (const messageName of channelMessageNames) {
      const schemaName = messageLookups[messageName]?.schemaName

      if (schemaName !== undefined) {
        schemaNames.add(schemaName)
      }
    }

    channelLookups.push({
      name: channelName,
      description: channel.description,
      address: channel.address,
      messageNames: Array.from(channelMessageNames).sort(),
      schemaNames: Array.from(schemaNames).sort(),
      operationNames: [...operationNames].sort()
    })
  }

  return {
    operations: operationLookups.sort((a, b) => a.name.localeCompare(b.name)),
    operationByName: new Map(operationLookups.map(operation => [operation.name, operation])),
    channels: channelLookups.sort((a, b) => a.name.localeCompare(b.name)),
    messages: Object.values(messageLookups).sort((a, b) => a.name.localeCompare(b.name)),
    messageByName: new Map(Object.values(messageLookups).map(message => [message.name, message])),
    schemas: Object.keys(schemas).sort(),
    schemaEntries: schemas as SchemaEntries
  }
}

function renderLinkedList (items: string[], prefix: string, emptyLabel: string): string {
  if (items.length === 0) {
    return `<p class="muted">${escapeHTML(emptyLabel)}</p>`
  }

  const links = items
    .map((item) => {
      if (prefix === 'message') {
        const eventRef = `/api/async-api/${encodeURIComponent(item)}`

        return `<a href="${escapeHTML(eventRef)}">${escapeHTML(item)}</a>`
      }

      return `<a href="#${toAnchorId(prefix, item)}">${escapeHTML(item)}</a>`
    })
    .join(', ')

  return `<p class="links">${links}</p>`
}

type ResolvedSchema = {
  schema: unknown
  refName?: string
  circular?: boolean
}

function resolveSchemaRef (
  schema: unknown,
  schemaEntries: SchemaEntries,
  seenRefs: Set<string>
): ResolvedSchema {
  if (!isRecord(schema)) {
    return { schema }
  }

  if (!('$ref' in schema)) {
    return { schema }
  }

  const refValue = String(schema.$ref)
  const schemaName = resolveSchemaNameFromRef(refValue)

  if (schemaName === undefined) {
    return { schema }
  }

  if (seenRefs.has(schemaName)) {
    return { schema, refName: schemaName, circular: true }
  }

  const resolved = schemaEntries[schemaName]

  if (resolved === undefined) {
    return { schema, refName: schemaName }
  }

  const nextSeen = new Set(seenRefs)

  nextSeen.add(schemaName)

  return { schema: resolved, refName: schemaName, circular: false }
}

function schemaToExample (
  schema: unknown,
  schemaEntries: SchemaEntries,
  seenRefs: Set<string>
): unknown {
  const resolved = resolveSchemaRef(schema, schemaEntries, seenRefs)

  if (resolved.circular === true && resolved.refName !== undefined) {
    return `[Circular:${resolved.refName}]`
  }

  if (!isRecord(resolved.schema)) {
    return resolved.schema
  }

  const record = resolved.schema

  if (record.example !== undefined) {
    return record.example
  }

  if (record.default !== undefined) {
    return record.default
  }

  if (Array.isArray(record.enum)) {
    return record.enum.length > 0 ? record.enum[0] : null
  }

  if (Array.isArray(record.oneOf)) {
    return schemaToExample(record.oneOf[0], schemaEntries, seenRefs)
  }

  if (Array.isArray(record.anyOf)) {
    return schemaToExample(record.anyOf[0], schemaEntries, seenRefs)
  }

  if (Array.isArray(record.allOf)) {
    return schemaToExample(record.allOf[0], schemaEntries, seenRefs)
  }

  if (record.type === 'array') {
    const itemExample = record.items !== undefined
      ? schemaToExample(record.items, schemaEntries, seenRefs)
      : null

    return [itemExample]
  }

  if (record.type === 'object' || isRecord(record.properties)) {
    const properties = isRecord(record.properties) ? record.properties : {}
    const example: UnknownRecord = {}

    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      example[propertyName] = schemaToExample(propertySchema, schemaEntries, seenRefs)
    }

    if (record.additionalProperties === true) {
      example.additionalProperty = 'string'
    } else if (isRecord(record.additionalProperties)) {
      example.additionalProperty = schemaToExample(
        record.additionalProperties,
        schemaEntries,
        seenRefs
      )
    }

    return example
  }

  if (record.type === 'integer' || record.type === 'number') {
    return 0
  }

  if (record.type === 'boolean') {
    return false
  }

  if (record.type === 'string') {
    return 'string'
  }

  return null
}

function renderSchemaView (
  schema: unknown,
  schemaEntries: SchemaEntries
): string {
  const seenRefs = new Set<string>()
  const example = schemaToExample(schema, schemaEntries, seenRefs)

  return `
    <div class="schema-block">
      <h4>Example</h4>
      ${valueToCodeBlock(example)}
    </div>
  `
}

function renderMessageView (
  message: AsyncAPIMessage | undefined,
  schemaEntries: SchemaEntries
): string {
  if (message === undefined) {
    return '<p class="muted">No message details available.</p>'
  }

  const contentType = typeof message.contentType === 'string' ? message.contentType : ''
  const summary = typeof message.summary === 'string' ? message.summary : ''
  const description = typeof message.description === 'string' ? message.description : ''

  return `
    <div class="meta-block">
      ${contentType !== '' ? `<p><strong>Content Type:</strong> ${escapeHTML(contentType)}</p>` : ''}
      ${summary !== '' ? `<p>${escapeHTML(summary)}</p>` : ''}
      ${description !== '' ? `<p>${escapeHTML(description)}</p>` : ''}
    </div>
    <div class="payload-block">
      <h4>Payload</h4>
      ${renderSchemaView(message.payload, schemaEntries)}
    </div>
  `
}

function renderMessageInlineDetails (
  messageNames: string[],
  messageByName: Map<string, MessageLookup>,
  schemaEntries: SchemaEntries
): string {
  const messageBlocks = messageNames.map((messageName) => {
    const message = messageByName.get(messageName)

    if (message === undefined) {
      return ''
    }

    const messageSchema = message.schemaName ?? ''

    return `
      <details class="sub-item">
        <summary>
          <span class="title">${escapeHTML(message.name)}</span>
          ${messageSchema !== '' ? `<span class="muted">Schema: ${escapeHTML(messageSchema)}</span>` : ''}
        </summary>
        <div class="detail-grid">
          <div>
            <h4>Schema</h4>
            ${messageSchema !== '' ? renderLinkedList([messageSchema], 'schema', 'No schema linked.') : '<p class="muted">No schema linked.</p>'}
          </div>
        </div>
        ${renderMessageView(message.message, schemaEntries)}
      </details>
    `
  })

  return messageBlocks.filter(Boolean).join('')
}

export function generateAsyncAPIHTML (
  yaml: string
): string {
  const document = parseAsyncApiDocument(yaml)
  const info = document.info
  const lookups = buildLookups(document)

  const title = escapeHTML(info.title)
  const version = escapeHTML(info.version)
  const description = escapeHTML(info.description ?? 'No description provided.')
  const asyncApiVersion = escapeHTML(document.asyncapi)

  const channelBlocks = lookups.channels.map((channel) => {
    const channelAddress = channel.address ?? ''
    const channelDescription = channel.description ?? ''
    const inlineOperations = channel.operationNames
      .map((operationName) => {
        const operation = lookups.operationByName.get(operationName)

        if (operation === undefined) {
          return ''
        }

        const operationAction = operation.action ?? ''
        const operationSummary = operation.summary ?? ''
        const operationDescription = operation.description ?? ''
        const operationChannel = operation.channelName ?? ''

        const operationMessageDetails = renderMessageInlineDetails(
          operation.messageNames,
          lookups.messageByName,
          lookups.schemaEntries
        )

        return `
          <details class="sub-item">
            <summary>
              <span class="title">${escapeHTML(operation.name)}</span>
              ${operationAction !== '' ? `<span class="badge">${escapeHTML(operationAction)}</span>` : ''}
            </summary>
            ${operationSummary !== '' ? `<p>${escapeHTML(operationSummary)}</p>` : ''}
            ${operationDescription !== '' ? `<p>${escapeHTML(operationDescription)}</p>` : ''}
            <div class="detail-grid">
              <div>
                <h4>Channel</h4>
                ${operationChannel !== '' ? renderLinkedList([operationChannel], 'channel', 'No channel linked.') : '<p class="muted">No channel linked.</p>'}
              </div>
              <div>
                <h4>Messages</h4>
                ${renderLinkedList(operation.messageNames, 'message', 'No messages linked.')}
              </div>
            </div>
            <div class="inline-stack">
              <h4>Message Details</h4>
              ${operationMessageDetails || '<p class="muted">No message details available.</p>'}
            </div>
          </details>
        `
      })
      .filter(Boolean)
      .join('')

    return `
    <details class="item" id="${toAnchorId('channel', channel.name)}">
      <summary>
        <span class="title">${escapeHTML(channel.name)}</span>
        ${channelAddress !== '' ? `<span class="muted">${escapeHTML(channelAddress)}</span>` : ''}
      </summary>
      ${channelDescription !== '' ? `<p>${escapeHTML(channelDescription)}</p>` : '<p class="muted">No description provided.</p>'}
      <div class="detail-grid">
        <div>
          <h4>Operations</h4>
          ${renderLinkedList(channel.operationNames, 'operation', 'No operations linked.')}
        </div>
        <div>
          <h4>Messages</h4>
          ${renderLinkedList(channel.messageNames, 'message', 'No messages linked.')}
        </div>
        <div>
          <h4>Schemas</h4>
          ${renderLinkedList(channel.schemaNames, 'schema', 'No schemas linked.')}
        </div>
      </div>
      <div class="inline-stack">
        <h4>Operation Details</h4>
        ${inlineOperations || '<p class="muted">No operation details available.</p>'}
      </div>
    </details>
  `
  }).join('')

  const operationBlocks = lookups.operations.map((operation) => {
    const operationAction = operation.action ?? ''
    const operationSummary = operation.summary ?? ''
    const operationDescription = operation.description ?? ''
    const operationChannel = operation.channelName ?? ''

    return `
    <details class="item" id="${toAnchorId('operation', operation.name)}">
      <summary>
        <span class="title">${escapeHTML(operation.name)}</span>
        ${operationAction !== '' ? `<span class="badge">${escapeHTML(operationAction)}</span>` : ''}
      </summary>
      ${operationSummary !== '' ? `<p>${escapeHTML(operationSummary)}</p>` : ''}
      ${operationDescription !== '' ? `<p>${escapeHTML(operationDescription)}</p>` : ''}
      <div class="detail-grid">
        <div>
          <h4>Channel</h4>
          ${operationChannel !== '' ? renderLinkedList([operationChannel], 'channel', 'No channel linked.') : '<p class="muted">No channel linked.</p>'}
        </div>
        <div>
          <h4>Messages</h4>
          ${renderLinkedList(operation.messageNames, 'message', 'No messages linked.')}
        </div>
      </div>
    </details>
  `
  }).join('')

  const messageBlocks = lookups.messages.map((message) => {
    const messageSchema = message.schemaName ?? ''
    const eventRef = `/api/async-api/${encodeURIComponent(message.name)}`

    return `
    <details class="item" id="${toAnchorId('message', message.name)}" data-message-name="${escapeHTML(message.name)}">
      <summary>
        <span class="title">${escapeHTML(message.name)}</span>
        ${messageSchema !== '' ? `<span class="muted">Schema: ${escapeHTML(messageSchema)}</span>` : ''}
      </summary>
      <p><strong>Ref:</strong> <a href="${escapeHTML(eventRef)}">${escapeHTML(eventRef)}</a></p>
      <div class="detail-grid">
        <div>
          <h4>Schema</h4>
          ${messageSchema !== '' ? renderLinkedList([messageSchema], 'schema', 'No schema linked.') : '<p class="muted">No schema linked.</p>'}
        </div>
      </div>
      ${renderMessageView(message.message, lookups.schemaEntries)}
    </details>
  `
  }).join('')

  const schemaBlocks = lookups.schemas.map((schemaName) => {
    const schemaValue = lookups.schemaEntries[schemaName]
    const description = isRecord(schemaValue) && typeof schemaValue.description === 'string'
      ? schemaValue.description
      : ''

    return `
    <details class="item" id="${toAnchorId('schema', schemaName)}">
      <summary>
        <span class="title">${escapeHTML(schemaName)}</span>
      </summary>
      ${description !== '' ? `<p>${escapeHTML(description)}</p>` : ''}
      ${renderSchemaView(schemaValue, lookups.schemaEntries)}
    </details>
  `
  }).join('')

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0f1115;
      --fg: #eef2f7;
      --muted: #9aa4b2;
      --border: #2b3139;
      --panel: #171b21;
      --accent: #4cc9f0;
      --accent-soft: #1f2a33;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0f1115;
        --fg: #eef2f7;
        --muted: #9aa4b2;
        --border: #2b3139;
        --panel: #171b21;
        --accent: #4cc9f0;
        --accent-soft: #1f2a33;
      }
    }

    body {
      margin: 0;
      padding: 32px;
      background: var(--bg);
      color: var(--fg);
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
    }

    main {
      width: 100%;
      margin: 0;
    }

    section {
      margin: 24px 0 40px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
    }

    h1, h2, h3, h4 {
      margin: 0 0 12px;
    }

    h1 {
      font-size: 2.4rem;
    }

    nav {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin: 16px 0 0;
    }

    nav a {
      background: var(--accent-soft);
      color: var(--accent);
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 999px;
      font-weight: 600;
      border: 1px solid transparent;
    }

    nav a:hover {
      border-color: var(--accent);
    }

    .muted {
      color: var(--muted);
    }

    .item {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 12px;
      background: color-mix(in srgb, var(--panel) 85%, var(--accent-soft));
    }

    summary {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      font-weight: 600;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .title {
      font-size: 1.1rem;
    }

    .badge {
      background: var(--accent-soft);
      color: var(--accent);
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 12px 0;
    }

    .sub-item {
      border: 1px dashed var(--border);
      border-radius: 10px;
      padding: 10px 12px;
      margin: 10px 0 0;
      background: color-mix(in srgb, var(--panel) 92%, var(--accent-soft));
    }

    .sub-item summary {
      font-size: 0.98rem;
    }

    .inline-stack {
      margin-top: 16px;
    }

    .meta-block {
      margin: 8px 0 12px;
    }

    .payload-block {
      margin-top: 12px;
    }

    .links {
      margin: 0;
    }

    .links a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }

    .links a:hover {
      text-decoration: underline;
    }

    .event-ref a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }

    .event-ref a:hover {
      text-decoration: underline;
    }

    pre {
      overflow-x: auto;
      background: #111827;
      color: #e2e8f0;
      border-left: 4px solid var(--accent);
      box-shadow: inset 0 0 0 1px #1f2937;
      tab-size: 2;
      border-radius: 10px;
      padding: 12px;
      font-size: 0.85rem;
      margin: 12px 0 0;
    }

    @media (max-width: 720px) {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <main>
    <section id="overview">
      <h1>${title}</h1>
      <p class="muted">AsyncAPI version: ${asyncApiVersion}</p>
      <p><strong>Version:</strong> ${version}</p>
      <p>${description}</p>
      <nav>
        <a href="#channels">Channels</a>
        <a href="#operations">Operations</a>
        <a href="#messages">Messages</a>
        <a href="#schemas">Schemas</a>
      </nav>
    </section>

    <section id="channels">
      <h2>Channels</h2>
      ${channelBlocks || '<p class="muted">No channels found.</p>'}
    </section>

    <section id="operations">
      <h2>Operations</h2>
      ${operationBlocks || '<p class="muted">No operations found.</p>'}
    </section>

    <section id="messages">
      <h2>Messages</h2>
      ${messageBlocks || '<p class="muted">No messages found.</p>'}
    </section>

    <section id="schemas">
      <h2>Schemas</h2>
      ${schemaBlocks || '<p class="muted">No schemas found.</p>'}
    </section>
  </main>
  <script>
    (() => {
      const channelDetails = Array.from(document.querySelectorAll('#channels details.item[id]'))
      const messageDetails = Array.from(document.querySelectorAll('details[data-message-name]'))

      const updateHash = (id) => {
        if (id === '') {
          return
        }

        const nextHash = '#' + id

        if (window.location.hash !== nextHash) {
          history.replaceState(null, '', nextHash)
        }
      }

      const focusDetailsById = (id) => {
        if (id === '') {
          return false
        }

        const target = document.getElementById(id)

        if (target instanceof HTMLDetailsElement) {
          target.open = true
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })

          return true
        }

        return false
      }

      for (const channelDetail of channelDetails) {
        channelDetail.addEventListener('toggle', () => {
          if (!channelDetail.open) {
            return
          }

          updateHash(channelDetail.id)
        })
      }

      window.addEventListener('hashchange', () => {
        const hashId = window.location.hash.replace(/^#/, '')

        focusDetailsById(hashId)
      })

      const hashId = window.location.hash.replace(/^#/, '')
      const openedByHash = focusDetailsById(hashId)

      const asyncApiPrefix = '/api/async-api/'
      const isEventPath = window.location.pathname.startsWith(asyncApiPrefix)

      if (!openedByHash && isEventPath) {
        const rawEventName = window.location.pathname.slice(asyncApiPrefix.length)
        const eventNameFromPath = rawEventName.endsWith('/') ? rawEventName.slice(0, -1) : rawEventName
        const eventName = decodeURIComponent(eventNameFromPath)
        const targetMessage = messageDetails.find((element) => element.getAttribute('data-message-name') === eventName)

        if (targetMessage !== undefined) {
          targetMessage.open = true
          targetMessage.scrollIntoView({ behavior: 'smooth', block: 'start' })
          updateHash(targetMessage.id)
        }
      }
    })()
  </script>
</body>
</html>
`

  return html
}
