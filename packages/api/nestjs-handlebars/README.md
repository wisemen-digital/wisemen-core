# `@wisemen/nestjs-handlebars`

Reusable NestJS Handlebars template rendering for Wisemen services.

## What it provides

- `HandlebarsRenderer` for `.hbs` template rendering
- `HandlebarsModule.forRoot()` and `HandlebarsModule.forRootAsync()` for DI-friendly registration
- Shared options and provider token exports for packages that want to wire the renderer themselves
