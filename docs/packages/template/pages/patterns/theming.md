# Theming

Project colors are defined in `src/themes/default.json`. This file contains a structured color palette with separate values for light and dark mode.

## Color configuration

`default.json` defines named color scales — brand, error, warning, success, gray, and others — each with tonal steps from 25 to 950:

```json
{
  "brand": {
    "25":  { "light": "#f5f8ff", "dark": "#0d1b3e" },
    "50":  { "light": "#eef2ff", "dark": "#112057" },
    "500": { "light": "#4f6fd0", "dark": "#6b8de8" },
    "900": { "light": "#1a2e6b", "dark": "#d0d9f8" }
  },
  "error": { … },
  "warning": { … },
  "success": { … },
  "gray": { … }
}
```

To change the project's color palette, edit the values in this file and regenerate the CSS (see below).

## Generating styles

After editing `default.json`, regenerate the CSS output by running the following command **from inside `apps/web`**:

```bash
vue-gen generate-styles
```

::: warning Run from apps/web
This command must be run from the `apps/web` directory, not the monorepo root.
:::

The command writes the result to `src/tailwind/style.css`, which is already imported in `src/main.ts`. You do not need to import anything else — the generated file wires up the CSS custom properties consumed by the design system and Tailwind.
