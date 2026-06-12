## Nestjs gen

[![npm version](https://img.shields.io/npm/v/@wisemen/ngen.svg)](https://www.npmjs.com/package/@wisemen/ngen)
[![npm downloads](https://img.shields.io/npm/dm/@wisemen/ngen.svg)](https://www.npmjs.com/package/@wisemen/ngen)
[![License](https://img.shields.io/npm/l/@wisemen/ngen.svg)](https://github.com/wisemen-digital/ngen/blob/main/LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.0-blue?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

Nestjs gen is a code generator for NestJS projects, designed to help you quickly scaffold modules, controllers, use-cases, and more, following best practices and conventions.

---

## Features

- Generate modules, controllers, use-cases, builders, decorators, and more for NestJS projects
- Pluggable architecture using [plop](https://plopjs.com/)
- Customizable templates for rapid development
- Built-in support for e2e test scaffolding
- TypeScript-first

---

## Getting Started

### Usage

Run the generator from your project root:

```sh
pnpx @wisemen/ngen
```

You will be prompted to select a generator (module, use-case, builder, etc.) and provide the required information.

## Project Structure

- `src/` - Source code for the generator
  - `generators/` - Plop generators for different NestJS components
  - `builder/` - Builder pattern utilities
  - `manipulators/` - Code manipulation utilities
  - `plop-generators/` - Plop generator definitions
  - `registry/` - Registry for available generators
  - `utils/` - Utility functions
- `templates/` - Handlebars templates for code generation

---

## Customization

You can customize or extend the templates in the `templates/` directory to fit your project's needs. Add your own generators or modify existing ones in `src/generators/`.

---

## Development

Use `pnpm test` to run the code in this repository.

---

## Contributing

Contributions are welcome! Please open issues or pull requests on [GitHub](https://github.com/wisemen-digital/ngen).

---

## License

MIT

---

### Changelog

The changelog can be found [here](./CHANGELOG.md).