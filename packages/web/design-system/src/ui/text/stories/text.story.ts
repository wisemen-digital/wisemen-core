import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  within,
} from 'storybook/test'

import TextPlayground from './TextPlayground.vue'

const meta = {
  title: 'Components/Text',
  argTypes: {
    as: {
      control: 'select',
      description: 'The HTML element to render as',
      options: [
        'span',
        'p',
        'h1',
        'h2',
        'h3',
        'div',
      ],
    },
    disableTooltip: {
      control: 'boolean',
      description: 'Disables the tooltip even if the text is truncated',
    },
    text: {
      control: 'text',
      description: 'The text content to display',
    },
    truncate: {
      control: 'select',
      description: 'Truncation mode: true for single line, or a number (2-6) for multi-line clamping',
      options: [
        true,
        2,
        3,
        4,
        5,
        6,
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: TextPlayground,
} satisfies Meta<typeof TextPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Hello World',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const text = canvas.getByText('Hello World')

    await expect(text).toBeVisible()
  },
}
