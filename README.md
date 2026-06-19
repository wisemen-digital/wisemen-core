# Wisemen Core

A collection of packages for Wisemen applications.

## Contributing

### Making Changes

1. **Create a PR** with your changes
2. **Add a Bumpy** to your PR describing the changes using:
   ```bash
   pnpm bumpy add
   ```
   If you have a change that doesn't bump a version, do `pnpm bumpy add --empty`
   For more details, see the [Bumpy documentation documentation](https://github.com/dmno-dev/bumpy)
3. **Merge your PR** – this triggers the `release` workflow
4. **Review the auto-generated PR** created by Bumpy, which includes:
   - Updated CHANGELOG files
   - Bumped version numbers
   - Release summary
5. **Merge the Bumpy release PR** to automatically publish all changed packages to npm

### New Package Setup

When creating a new package, use [fledgling](https://github.com/dmno-dev/fledgling) to claim the npm name and configure trusted publishing before the first release:

1. **Create the package in the workspace** – Add the new package under `packages/<group>/<package>` and make sure its `package.json` has the correct `name`.
2. **Claim the name with fledgling** – Run fledgling from the repo root so it can discover the new workspace package:
   ```bash
   pnpm fledgling
   ```
   will open an interactive window, which will guide you through claiming the package name and configuring trusted publishing.
3. **Keep exclusions in sync** – If a public package should not be managed by fledgling, add its name or glob to the `fledgling.ignore` list in the root `package.json`.
4. **Release through Bumpy** – Once the package is claimed and trusted publishing is configured, normal releases continue through the Bumpy workflow.

`fledgling` reads the workspace manifests defined in `package.json` and `pnpm-workspace.yaml`, so the repo only needs to expose the actual workspace packages. In this repo that means `docs` plus `packages/*/*`.

## Packages

- **[Address](./packages/address)** – Address utilities and validation
- **[API Error](./packages/api-error)** – Standardized API error handling
- **[API Utils](./packages/api-utils)** – Common API utilities and helpers
- **[App Container](./packages/app-container)** – Application container component
- **[Auth](./packages/auth)** – Authentication utilities tailored for Zitadel
- **[Components](./packages/components)** – A collection of core UI components
- **[Components Next](./packages/components-next)** – The next generation of UI components
- **[Coordinates](./packages/coordinates)** – Coordinate utilities
- **[CSV](./packages/csv)** – CSV parsing and generation
- **[Date Range](./packages/date-range)** – Date range utilities
- **[Date Time Range](./packages/date-time-range)** – Date-time range utilities
- **[Datewise](./packages/datewise)** – Date-wise data operations
- **[Decorators](./packages/decorators)** – Useful TypeScript decorators
- **[Design System](./packages/design-system)** – Design system components and tokens
- **[ESLint Config](./packages/eslint-config)** – Shared ESLint configuration
- **[ESLint Config NestJS](./packages/eslint-config-nestjs)** – NestJS-specific ESLint configuration
- **[ESLint Plugin](./packages/eslint-plugin)** – Custom ESLint rules
- **[Express DTO Router](./packages/express-dto-router)** – DTO validation for Express routers
- **[Formango](./packages/formango)** – Form management utilities
- **[Format](./packages/web/format)** – Locale-aware string and number formatting utilities.
- **[Generator](./packages/generator)** – Code generation tools
- **[Icons](./packages/icons)** – Icon library and utilities
- **[Int Range](./packages/int-range)** – Integer range utilities
- **[Localized String](./packages/localized-string)** – Localization string handling
- **[Modules](./packages/modules)** – Modular application structure
- **[Monetary](./packages/monetary)** – Monetary value utilities
- **[NestJS Async API](./packages/nestjs-async-api)** – AsyncAPI integration for NestJS
- **[NestJS File Storage](./packages/nestjs-file-storage)** – File storage for NestJS
- **[NestJS TypeORM](./packages/nestjs-typeorm)** – TypeORM integration for NestJS
- **[Node Doc Processor](./packages/node-doc-processor)** – Documentation processor for Node
- **[One Of](./packages/one-of)** – Type-safe union utilities
- **[Open API Plugins](./packages/open-api-plugins)** – OpenAPI plugin utilities
- **[OpenTelemetry](./packages/opentelemetry)** – OpenTelemetry integration
- **[Pagination](./packages/pagination)** – Pagination utilities
- **[PGBoss NestJS Job](./packages/pgboss-nestjs-job)** – PGBoss job queue for NestJS
- **[Planning](./packages/planning)** – Planning and scheduling utilities
- **[Quantity](./packages/quantity)** – Quantity handling utilities
- **[Telemetry](./packages/telemetry)** – Telemetry and monitoring utilities
- **[Template TypeScript](./packages/template-typescript)** – TypeScript package template
- **[Template Vue](./packages/template-vue)** – Vue package template
- **[Time](./packages/time)** – Time utilities
- **[Transformer](./packages/transformer)** – Data transformation utilities
- **[Twilio](./packages/twilio)** – Twilio integration utilities
- **[Validators](./packages/validators)** – Validation utilities and schemas
- **[VIES](./packages/vies)** – VIES VAT validation
- **[Wise Date](./packages/wise-date)** – Advanced date utilities
- ~~**[Zod HTTP Client](./packages/zod-http-client)**~~ _(Deprecated)_ – A Zod-based HTTP client for Vue applications

## License

This project is licensed under the [PolyForm Strict License 1.0.0](./LICENSE.md).

**Wisemen Core** is developed primarily for internal use by the Wisemen agency. We make this codebase freely available for non-commercial purposes, allowing the community to learn from and use our tools at no cost. However, commercial use by other agencies or organizations requires explicit permission.

### What this means (in plain English)

- ✅ **You may freely use** the software for any **non-commercial** purpose  
  (personal projects, research, education, hobby, non-profit, government, internal evaluation, etc.)
- ❌ **You may not** modify, adapt, or create derivative works
- ❌ **You may not** redistribute or share the code (or any modified version)

### Commercial use or enterprise licensing?

We offer flexible commercial licenses, support contracts, and custom arrangements for businesses.  
Please get in touch at **sales@wisemen.digital** (or your preferred contact) if you'd like to discuss licensing options.

For more details about what you can and cannot do with this software, please refer to the [LICENSE](./LICENSE.md) file.

_Thank you for respecting the license and supporting years of development on wisemen-core!_

### Repository Stats

Use the stats script to inspect activity over the last 30 days:

```bash
pnpm repo:stats
```
