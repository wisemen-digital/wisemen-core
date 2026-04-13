import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true, // Clean output directory
  dts: true, // Usually, you'd want declaration files
  entry: [
    'src/index.ts',
  ],
  external: [
    'typescript',
  ],
})
