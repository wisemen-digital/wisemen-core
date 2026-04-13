import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import RowLayoutPlayground from './RowLayoutPlayground.vue'

const meta = {
  title: 'Components/RowLayout',
  argTypes: {
    align: {
      control: 'select',
      description: 'Vertical alignment of items',
      options: [
        'center',
        'end',
        'start',
      ],
    },
    gap: {
      control: 'select',
      description: 'Gap between items',
      options: [
        'none',
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
      ],
    },
    justify: {
      control: 'select',
      description: 'Horizontal justification of items',
      options: [
        'between',
        'center',
        'end',
        'start',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: RowLayoutPlayground,
} satisfies Meta<typeof RowLayoutPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    align: 'center',
    gap: 'md',
    justify: 'start',
  },
}
