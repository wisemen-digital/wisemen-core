import { describe, it } from 'node:test'
import { expect } from 'expect'
import { BasicAuthModule } from '../basic-auth.module.js'

describe('BasicAuthModule', () => {
  it('creates a feature module with inline definitions', () => {
    const moduleDefinition = BasicAuthModule.forFeature({
      docs: {
        username: 'docs',
        password: 'secret'
      }
    })

    expect(moduleDefinition.imports).toBeUndefined()
    expect(moduleDefinition.providers).toHaveLength(2)
  })

  it('creates a feature module with async definitions', async () => {
    const moduleDefinition = BasicAuthModule.forFeatureAsync({
      imports: [class ConfigModule {}],
      inject: ['CONFIG'],
      useFactory: (config: { username: string, password: string }) => ({
        docs: {
          username: config.username,
          password: config.password
        }
      })
    })

    expect(moduleDefinition.imports).toHaveLength(1)
    expect(moduleDefinition.providers).toHaveLength(2)

    const definitionsProvider = moduleDefinition.providers?.[0]

    if (definitionsProvider === undefined || !('useFactory' in definitionsProvider)) {
      throw new Error('Expected the first provider to define useFactory')
    }

    expect(definitionsProvider.inject).toEqual(['CONFIG'])
    await expect(definitionsProvider.useFactory({
      username: 'docs',
      password: 'secret'
    })).resolves.toEqual({
      docs: {
        username: 'docs',
        password: 'secret'
      }
    })
  })
})
