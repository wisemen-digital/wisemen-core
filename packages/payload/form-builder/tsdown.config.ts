import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/admin/index.ts',
    'src/seeders/contactForm.seed.ts',
  ],
  external: [
    '@payloadcms/ui',
    '@wisemen/payload-core-seeder',
    'payload',
    'react',
  ],
  format: [
    'esm',
  ],
  shims: true,
})
