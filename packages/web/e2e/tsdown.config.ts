import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/config/index.ts',
  ],
  format: [
    'esm',
  ],
  shims: true,
})
