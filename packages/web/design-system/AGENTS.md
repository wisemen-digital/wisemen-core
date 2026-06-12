# Design System Agent Notes

## Storybook Work

When editing or creating files in `src/**/stories/`:

1. Read `skills/storybook/SKILL.md`.
2. If the story belongs to a documented component, also read the matching component skill in `skills/components/<component>/SKILL.md`.

Use `skills/storybook/SKILL.md` as the source of truth for:

- `Meta` typing with `satisfies`
- `argTypes.description` requirements
- hiding noisy controls like `hideErrorMessage` and `modelValue`
- preferred story names such as `Default`, `AllVariants`, `AllSizes`, and `AllStates`
- using showcase stories instead of repetitive enum-per-story variants
- consistent `render(args)` patterns for playground stories
