# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).




## 0.8.4
<sub>2026-06-26</sub>

- [#1282](https://github.com/wisemen-digital/wisemen-core/pull/1282)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: improve ngen templates

## 0.8.3
<sub>2026-06-25</sub>

- [#1280](https://github.com/wisemen-digital/wisemen-core/pull/1280)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: unresolved entity

## 0.8.2
<sub>2026-06-16</sub>

- [#1262](https://github.com/wisemen-digital/wisemen-core/pull/1262)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: move @wisemen/ngen to wisemen-core repo

## [0.8.1] - 2026-05-29

### Changed 
- Detect import style from package.json

## [0.8.0] - 2026-02-02

### Changed
- Move path and version from controller decorator to method decorator
- Allow path options for cronjob generation
- Insert new enum alphabetically
- Typesense multisearch insert alphabetically

### Added
- Add integration test for typesense

## [0.7.2] - 2025-11-13

### Changed 
- Replace `@IsOptional` with `@IsUndefinable` in query

## [0.7.1] - 2025-11-07

### Changed

- Fixed typos e2e test
- Removed `reset` from builders
- Fix base event not generated for custom use case
- Update file name not found error

### Updated

- Updated dependencies

## [0.7.0] - 2025-10-10

### Changed

- Add domain event generation for custom use cases
- Rename testSetup to setup in tests and use httpServer directly


## [0.6.0] - 2025-10-06

### Changed

- Use explicit versioning in controller & controller e2e tests
- Use typed uuid in typesense entity

## [0.5.0] - 2025-09-23

### Changed

- Updated typesense collector to use generators

## [0.4.0] - 2025-09-18

### Added

- Add translation generators for notifications and event logs

### Changed

- Remove suffix `Entity` for entity builder
- Enhanced error messages

## [0.3.3] - 2025-08-07

### Fixed

- Use ts-morph kind instead of typescript to prevent typescript version mismatches

## [0.3.2] - 2025-08-01

### Fixed

- Fixed typesense entity module import when registering in `TypesenseModule`
- Fixed typesense entity collector `fetchRemoved`

### Changed

- Removed `DomainEventEmitterModule` from use case module

## [0.3.1] - 2025-07-20

### Fixed

- Fixed release configuration
- Fixed changelog
- Fixed job generation

## [0.3.0] - 2025-07-17

### Added

- Add typesense module generation with optional subscriber module
- Add cronjob generation
- Add job generation

## [0.2.0] - 2025-06-XX

### Added

- Event generation for create/update/delete
- Unit tests for create/update/delete use cases
- E2E tests
- Typed uuid for entities
- Entity not found error in use cases
- Added new command for generating translation keys for permission enum
- Extended builders with interface support

[Unreleased]: https://github.com/wisemen-digital/nestjs-gen/compare/0.8.1...main
[0.8.1]: https://github.com/wisemen-digital/nestjs-gen/compare/0.8.0...0.8.1
[0.8.0]: https://github.com/wisemen-digital/nestjs-gen/compare/0.7.2...0.8.0
[0.7.2]: https://github.com/wisemen-digital/nestjs-gen/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/wisemen-digital/nestjs-gen/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/wisemen-digital/nestjs-gen/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/wisemen-digital/nestjs-gen/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/wisemen-digital/nestjs-gen/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/wisemen-digital/nestjs-gen/compare/0.3.3...0.4.0
[0.3.3]: https://github.com/wisemen-digital/nestjs-gen/compare/0.3.2...0.3.3
[0.3.2]: https://github.com/wisemen-digital/nestjs-gen/compare/0.3.1...0.3.2
[0.3.1]: https://github.com/wisemen-digital/nestjs-gen/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/wisemen-digital/nestjs-gen/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/wisemen-digital/nestjs-gen/releases/tag/0.2.0
