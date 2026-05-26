import {
  figma,
  html,
} from '@figma/code-connect/html'

/**
 * Figma Code Connect for Button
 * Figma node: https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=3287-427074
 *
 * Publish: FIGMA_ACCESS_TOKEN=<token> pnpm figma:publish
 */
figma.connect(
  'https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=3287-427074',
  {
    example: ({
      isDisabled,
      isLoading,
      size,
      variant,
    }) => html`
      <AppButton
        label="Button CTA"
        variant="${variant}"
        size="${size}"
        ${isDisabled}
        ${isLoading}
      />
    `,

    props: {
      // Map State to attribute strings so the template can use ${isDisabled} directly
      isDisabled: figma.enum('State', {
        Disabled: ':is-disabled="true"',
      }),
      isLoading: figma.enum('State', {
        Loading: ':is-loading="true"',
      }),

      // Figma sizes are one step larger than Vue sizes (xl→lg, lg→md, md→sm)
      size: figma.enum('Size', {
        lg: 'md',
        md: 'sm',
        xl: 'lg',
      }),

      // Figma "Hierarchy" → Vue "variant"
      // Note: "Minimal gray" has no Vue equivalent and is intentionally omitted
      variant: figma.enum('Hierarchy', {
        'Minimal color': 'minimal-color',
        'Primary': 'primary',
        'Secondary': 'secondary',
        'Tertiary': 'tertiary',
      }),
    },
  },
)
