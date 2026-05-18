import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  external: [
    'libphonenumber-js',
  ],
  format: [
    'esm',
  ],
  shims: true,
})
