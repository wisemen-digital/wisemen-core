---
name: storybook
description: >
  Conventions for Storybook stories and playground components in vue-core-design-system. Use
  when creating, updating, reviewing, or refactoring files in src/**/stories/, especially for
  argTypes, control hygiene, story naming, meta typing, and showcase story structure.
type: workflow
library: vue-core-design-system
category: contributing
---

# Storybook Conventions

Use this skill when working on Storybook files in `packages/web/design-system/src/**/stories/`.

If the component also has its own skill in `skills/components/`, use both:

- the component skill for API and usage intent
- this skill for story structure and consistency

## Canonical References

Read the most relevant existing examples before editing:

- `src/ui/button/button/stories/button.story.ts`
- `src/ui/badge/stories/badge.story.ts`
- `src/ui/featured-icon/stories/featuredIcon.story.ts`
- `src/ui/timeline/stories/timeline.story.ts`
- `src/ui/loader/stories/loader.story.ts`
- `src/ui/checkbox-group/stories/checkboxGroup.story.ts`

## Required Conventions

### Meta typing

Use:

```ts
const meta = {
  // ...
} satisfies Meta<typeof StoryComponent>
```

Do not use:

```ts
const meta: Meta<typeof StoryComponent> = {
  // ...
}
```

### ArgTypes

Every visible argType must have a `description`.

Descriptions should explain the user-facing or visual effect, not just restate the prop name.

Good:

```ts
variant: {
  control: 'select',
  description: 'Visual style variant of the button',
  options: ['primary', 'secondary'],
}
```

Weak:

```ts
variant: {
  control: 'select',
  description: 'The variant',
}
```

### Controls hygiene

Hide props from Controls when they are internal, non-visual, or only meaningful with extra wiring.

Preferred pattern:

```ts
hideErrorMessage: {
  table: {
    disable: true,
  },
}
```

Common cases to hide:

- `hideErrorMessage`
- `modelValue`
- reactive refs or story-only state
- props that do not make sense in isolated Storybook usage

### Story naming

Prefer:

- `Default`
- `AllVariants`
- `AllSizes`
- `AllStates`
- `WithError`
- `Disabled`
- `Loading`
- `SmallSize`
- `FormExample`

Avoid enum-named stories like `Solid`, `Outline`, or `Translucent` when the prop is already exposed through controls.

### Showcase structure

Do not create one story per variant/color/size when controls already cover that prop unless the stories demonstrate meaningfully different behavior.

Prefer:

- one interactive `Default` story
- one showcase story such as `AllVariants`, `AllSizes`, or `AllStates`

Use a dedicated playground component when a grid or comparison layout is needed.

### Render functions

When a story uses `render`, use this pattern:

```ts
render: (args) => ({
  components: {
    PlaygroundComponent,
  },
  setup() {
    return {
      args,
    }
  },
  template: '<PlaygroundComponent v-bind="args" />',
})
```

Do not omit `setup()` when the story is args-driven.

### Playground components

Interactive playgrounds should accept only meaningful story args.

Showcase playgrounds should:

- render multiple variants, sizes, or states at once
- avoid duplicating enum-named stories
- keep the layout easy to scan

### File placement

Story files belong in a `stories/` folder next to the documented component.

Prefer:

- `component/stories/component.story.ts`

## Workflow

1. Inspect the existing story and one canonical reference story.
2. Add or improve `argTypes.description` for every visible control.
3. Hide noisy controls with `table.disable`.
4. Normalize story names to the preferred set.
5. Replace repetitive enum-per-story patterns with showcase stories when appropriate.
6. Normalize `render` functions and meta typing.
7. Add or adjust a playground component if the story needs `AllVariants`, `AllSizes`, or `AllStates`.

## Verification

After story edits in `packages/web/design-system`:

1. Run targeted ESLint on changed files, preferably with `--fix`.
2. Run `pnpm type-check` in `packages/web/design-system`.
3. If Storybook is actively being worked on, visually verify:
   - controls are meaningful
   - descriptions appear in Controls/autodocs
   - showcase grids are easy to scan

## Default Biases

When in doubt:

- prefer fewer, stronger stories over many repetitive ones
- prefer showcase stories over enum-named duplicates
- prefer hidden controls over exposing implementation details
- prefer consistency with the strongest existing stories over inventing a new pattern
