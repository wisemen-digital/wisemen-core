import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/client.ts',
    'src/server.ts',
  ],
  external: [
    '@wisemen/payload-core-translate',
    '@wisemen/payload-core-translate/client',
    '@payloadcms/ui',
    'payload',
    'react',
  ],
  format: [
    'esm',
  ],

  shims: true,
})
