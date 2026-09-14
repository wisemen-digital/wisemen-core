import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'
import type { AsyncAPIDocument } from '../async-api.types.js'
import { generateAsyncAPIHTML } from '../generate-async-api-html.js'
import { generateAsyncApiYaml } from '../generate-async-api-yaml.js'

async function generateSessionYaml (): Promise<string> {
  return await generateAsyncApiYaml({
    asyncapi: '3.0.0',
    defaultContentType: 'application/json',
    info: { title: 'Session', version: '1.0.0' },
    channels: fileURLToPath(new URL('./fixtures/session.channel.js', import.meta.url))
  })
}

describe('AsyncAPI generation', () => {
  it('converts Swagger metadata into JSON Schema without changing required properties', async () => {
    const yaml = await generateSessionYaml()
    const document = YAML.parse(yaml) as AsyncAPIDocument
    const schema = document.components!.schemas!.SessionState
    const properties = schema.properties as Record<string, unknown>

    assert.deepEqual(properties.currentTestExerciseUuid, {
      type: ['string', 'null'], format: 'uuid', description: 'Current exercise'
    })
    assert.deepEqual(properties.answers, { type: ['array', 'null'], items: { type: ['string', 'null'] } })
    assert.deepEqual(properties.grade, {
      anyOf: [{ allOf: [{ $ref: '#/components/schemas/Grade' }] }, { type: 'null' }]
    })
    assert.deepEqual(schema.required, ['currentTestExerciseUuid', 'acceptInput', 'grade', 'answers'])
    assert.doesNotMatch(yaml, /nullable:/)
  })

  it('shows nullable types and required status alongside examples', async () => {
    const html = generateAsyncAPIHTML(await generateSessionYaml())

    assert.match(html, /currentTestExerciseUuid<\/code><\/td>\s*<td><code>string \(uuid\) \| null/)
    assert.match(html, /string \(uuid\) \| null<\/code><\/td>\s*<td>Yes<\/td>/)
    assert.match(html, /label<\/code><\/td>\s*<td><code>string<\/code><\/td>\s*<td>No<\/td>/)
    assert.match(html, /Grade \| null/)
    assert.match(html, /Array&lt;string \| null&gt; \| null/)
    assert.match(html, /Current exercise/)
    assert.match(html, /&quot;currentTestExerciseUuid&quot;: &quot;string&quot;/)
    assert.match(html, /&quot;acceptInput&quot;: false/)
    assert.match(html, /<summary>Schema<\/summary>/)
  })

  it('links messages and references to existing anchors within the document', async () => {
    const html = generateAsyncAPIHTML(await generateSessionYaml())
    const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]))
    const hrefs = Array.from(html.matchAll(/\bhref="([^"]+)"/g), match => match[1])

    assert.ok(hrefs.includes('#message-sessionstate'))
    assert.match(html, /<strong>Ref:<\/strong> <a href="#message-sessionstate">/)

    for (const href of hrefs) {
      assert.ok(href.startsWith('#'), `Expected an in-page link: ${href}`)
      assert.ok(ids.has(href.slice(1)), `Missing anchor target for ${href}`)
    }
  })

  it('supports legacy nullable metadata and escapes property documentation', () => {
    const html = generateAsyncAPIHTML(YAML.stringify({
      asyncapi: '3.0.0', info: { title: 'Legacy', version: '1' }, channels: {},
      components: {
        schemas: {
          Legacy: {
            type: 'object', properties: {
              '<script>': { type: 'string', nullable: true, description: '<img onerror="alert(1)">' }
            }
          }
        }
      }
    }))

    assert.match(html, /string \| null/)
    assert.match(html, /&lt;script&gt;/)
    assert.match(html, /&lt;img onerror=&quot;alert\(1\)&quot;&gt;/)
    assert.doesNotMatch(html, /<img onerror=/)
  })

  it('terminates examples for recursive nullable references and preserves external references', () => {
    const html = generateAsyncAPIHTML(YAML.stringify({
      asyncapi: '3.0.0', info: { title: 'Recursive', version: '1' }, channels: {},
      components: {
        schemas: {
          Tree: {
            type: 'object', properties: {
              child: { nullable: true, allOf: [{ $ref: '#/components/schemas/Tree' }] },
              external: { $ref: 'https://example.com/schema.json' }
            }
          }
        }
      }
    }))

    assert.match(html, /Tree \| null/)
    assert.match(html, /\[Circular:Tree\]/)
    assert.match(html, /https:\/\/example.com\/schema.json/)
  })
})
