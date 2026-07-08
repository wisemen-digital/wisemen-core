import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/client.ts',
    'src/server.ts',
  ],
  external: [
    '@payloadcms/ui',
    '@wisemen/payload-core-utils',
    'next',
    'payload',
    'react',
  ],
  format: [
    'esm',
  ],
  shims: true,
})
