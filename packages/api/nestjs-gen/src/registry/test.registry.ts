import { ResolverRegistry } from './helpers/resolver-registry.js'

const testResolvers = {
  setup: {
    glob: 'test/**/test-setup.ts',
    type: 'class',
    name: 'TestSetup'
  },
  testBench: {
    glob: 'test/**/test-bench.ts',
    type: 'class',
    name: 'TestBench'
  },
  testUser: {
    glob: 'src/**/setup-user.type.ts',
    type: 'interface',
    name: 'TestUser'
  },
  stubDataSource: {
    glob: 'test/**/stub-datasource.ts',
    type: 'function',
    name: 'stubDataSource'
  }
} as const

export const TestResolverRegistry = new ResolverRegistry(testResolvers)
