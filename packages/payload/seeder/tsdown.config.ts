import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/client.ts',
    'src/server.ts',
    'src/bin/seed.ts',
  ],
  external: [
    '@payloadcms/ui',
    'payload',
    'react',
    'react-dom',
  ],
  format: [
    'esm',
  ],
  shims: true,
})
