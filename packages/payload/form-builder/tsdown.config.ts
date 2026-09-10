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
    '@wisemen/payload-core-utils',
    '@orpc/contract',
    'payload',
    'react',
    'zod',
  ],
  format: [
    'esm',
  ],
  shims: true,
})
