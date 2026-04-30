import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/i18n.ts',
  ],
  format: [
    'esm',
  ],
  shims: true,
})
