import TypesenseSdk from 'typesense'
import { TypesenseClient } from '../../client/typesense.client.js'
import type { TypesenseCollectors } from '../../collectors/typesense-collectors.js'
import type { TypesenseModuleOptions } from '../../typesense.module-options.js'

function testTypesenseOptions (): TypesenseModuleOptions {
  return {
    nodes: [{
      host: process.env.TYPESENSE_HOST ?? 'localhost',
      port: Number(process.env.TYPESENSE_PORT ?? 8108),
      protocol: process.env.TYPESENSE_PROTOCOL ?? 'http'
    }],
    apiKey: process.env.TYPESENSE_API_KEY ?? 'xyz',
    connectionTimeoutSeconds: 5
  }
}

export function createTestTypesenseClient (): TypesenseSdk.Client {
  return new TypesenseSdk.Client(testTypesenseOptions())
}

export function createTestTypesenseClientService (collectors: TypesenseCollectors = {} as TypesenseCollectors): TypesenseClient {
  return new TypesenseClient(testTypesenseOptions(), collectors)
}
