import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'bin/seed': 'src/bin/seed.ts',
    'index': 'src/index.ts',
  },
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
