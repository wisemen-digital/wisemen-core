import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  external: [
    '@wisemen/payload-core-utils',
    'payload',
  ],
  format: [
    'esm',
  ],
  shims: true,
})
