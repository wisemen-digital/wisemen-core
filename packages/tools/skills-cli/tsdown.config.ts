import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  entry: [
    'src/index.ts',
    'src/build-manifest.ts',
    'src/build-manifest-bin.ts',
  ],
  format: [
    'esm',
  ],
  outputOptions: {
    banner: (chunk) => (chunk.fileName === 'index.mjs' ? '#!/usr/bin/env node' : ''),
  },
  shims: true,
})
