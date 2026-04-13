# Wisemen Core

A collection of packages for Wisemen applications.

## Contributing

### Making Changes

1. **Create a PR** with your changes
2. **Add a changeset** to your PR describing the changes using:
   ```bash
   pnpm changeset
   ```
   For more details, see the [Changesets documentation](https://github.com/changesets/changesets/blob/main/README.md)
3. **Merge your PR** – this triggers the `changeset-release/main` workflow
4. **Review the auto-generated PR** created by the changeset bot, which includes:
   - Updated CHANGELOG files
   - Bumped version numbers
   - Release summary
5. **Merge the changeset release PR** to automatically publish all changed packages to npm

### New Package Setup

When creating a new package:

1. **Manual first release** – The first version must be published manually since the package doesn't exist on npm yet:
   ```bash
   pnpm publish
   ```
2. **Setup OIDC Trusted Publishers** – Configure your npm package with GitHub OIDC so future releases are automated:
   - Go to your npm package settings
   - Add GitHub as a trusted publisher
   - Configure the repository, branch, and environment

After this setup, all future releases will be automatic through the changeset workflow.

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
- ~~**[Zod HTTP Client](./packages/zod-http-client)**~~ *(Deprecated)* – A Zod-based HTTP client for Vue applications

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

*Thank you for respecting the license and supporting years of development on wisemen-core!*
