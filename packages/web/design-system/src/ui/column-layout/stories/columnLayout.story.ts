import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import ColumnLayoutPlayground from './ColumnLayoutPlayground.vue'

const meta = {
  title: 'Components/ColumnLayout',
  tags: [
    'autodocs',
  ],
  component: ColumnLayoutPlayground,
} satisfies Meta<typeof ColumnLayoutPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
