import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: false,
  entry: [
    'src/index.ts',
  ],
  external: [
    '@wisemen/payload-core-form-builder',
    '@nuxt/ui',
    '@vueuse/core',
    'formango',
    'motion-v',
    'vue',
    'zod',
  ],
  format: [
    'esm',
  ],
  fromVite: true,
  shims: true,
})
