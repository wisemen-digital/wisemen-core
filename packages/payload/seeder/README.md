# @wisemen-core/payload-core-seeder

Type-safe database seeding for [Payload CMS](https://payloadcms.com/) — write seed data in `seed.ts` files, reference other docs with typed tokens instead of raw ids, attach upload files inline, and the plugin orders dependencies and creates everything.

```bash
pnpm add @wisemen-core/payload-core-seeder
```

**Requires** Payload `^3` and React 19. **No framework requirement** — zero `next/` imports, no `next` peer; runs in any Payload app.

Localized fields accept a map of the configured locale codes. The runner writes
the matching value in each locale, including nested fields:

```ts
{
  title: {
    en: 'About us',
    nl: 'Over ons',
  },
}
```
