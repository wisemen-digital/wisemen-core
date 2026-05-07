import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  entry: [
    'src/index.ts',
  ],
  format: [
    'esm',
  ],
  outputOptions: {
    banner: (chunk) => (chunk.fileName === 'index.mjs' ? '#!/usr/bin/env node' : ''),
  },
  shims: true,
})
