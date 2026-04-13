import { globSync } from 'fs'
import assert from 'assert'
import { pathToFileURL } from 'url'
import { resolve } from 'path'
import YAML from 'yaml'
import { SchemaObjectFactory } from '@nestjs/swagger/dist/services/schema-object-factory.js'
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor.js'
import { SwaggerTypesMapper } from '@nestjs/swagger/dist/services/swagger-types-mapper.js'
import { pascalCase } from 'change-case'
import { AsyncAPIDocument, AsyncApiRef } from './async-api.types.js'
import { AsyncAPIChannelDefinition, AsyncAPIDefinition } from './async-api-definition.types.js'
import { isChannel } from './create-channel.js'

export async function generateAsyncApiYaml (api: AsyncAPIDefinition): Promise<string> {
  const apiDocs: AsyncAPIDocument = {
    asyncapi: api.asyncapi,
    info: api.info,
    defaultContentType: api.defaultContentType,
    channels: {},
    operations: {},
    components: { messages: {}, schemas: {} }
  }

  const channelFiles = globSync(api.channels)
  const channels: Record<string, AsyncAPIChannelDefinition<string>> = {}

  for (const channelFile of channelFiles) {
    const absolutePath = pathToFileURL(resolve(process.cwd(), channelFile)).href
    const moduleExports = await import(absolutePath) as Record<string, object>

    for (const exportedKey in moduleExports) {
      const exported = moduleExports[exportedKey]

      if (typeof exported !== 'object') {
        continue
      }

      if (isChannel(exported)) {
        const channelName = pascalCase(exportedKey.substring(0, exportedKey.indexOf('Channel')))

        assert(channels[channelName] === undefined, `duplicate channel name ${channelName}`)
        channels[channelName] = exported
      }
    }
  }

  const accessor = new ModelPropertiesAccessor()
  const typeMapper = new SwaggerTypesMapper()

  for (const channelName in channels) {
    const channel = channels[channelName]
    const channelRef: AsyncApiRef = { $ref: '#/channels/' + channelName }
    const channelMessages: Record<string, AsyncApiRef> = {}

    for (const operationName in channel.operations) {
      const operation = channel.operations[operationName]
      const operationMessages: AsyncApiRef[] = []

      for (const message of operation.messages!) {
        const name = message.name

        const factory = new SchemaObjectFactory(accessor, typeMapper)

        factory.exploreModelSchema(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          message as unknown as Function,
          apiDocs.components!.schemas!
        )

        // Add the message itself
        apiDocs.components!.messages![name] = {
          name: name,
          contentType: 'application/json',
          payload: { $ref: `#/components/schemas/${name}` }
        }

        operationMessages.push({ $ref: `#/channels/${channelName}/messages/${name}` })
        channelMessages[name] = { $ref: '#/components/messages/' + name }
      }

      apiDocs.operations![operationName] = {
        channel: channelRef,
        action: operation.action,
        bindings: operation.bindings,
        deprecated: operation.deprecated,
        description: operation.description,
        externalDocs: operation.externalDocs,
        security: operation.security,
        summary: operation.summary,
        title: operation.title,
        tags: operation.tags,
        traits: operation.traits,
        messages: operationMessages
      }
    }

    apiDocs.channels[channelName] = {
      address: channel.address,
      parameters: channel.parameters,
      messages: channelMessages
    }
  }

  return YAML.stringify(apiDocs)
}
