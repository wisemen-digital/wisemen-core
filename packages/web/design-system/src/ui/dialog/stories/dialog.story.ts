import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import ConfirmDialogPlayground from './ConfirmDialogPlayground.vue'
import DialogPlayground from './DialogPlayground.vue'
import DialogScrollablePlayground from './DialogScrollablePlayground.vue'

const meta = {
  title: 'Components/Dialog',
  argTypes: {
    preventClickOutside: {
      control: 'boolean',
    },
    preventEsc: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: [
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        'full-screen',
      ],

    },
  },
  tags: [
    'autodocs',
  ],
  component: DialogPlayground,
} satisfies Meta<typeof DialogPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    preventClickOutside: false,
    preventEsc: false,
    size: 'md',
  },
}

export const Confirm: StoryObj<typeof ConfirmDialogPlayground> = {
  args: {
    isDestructive: true,
    preventClickOutside: false,
    preventEsc: false,
    size: 'xs',
  },
  argTypes: {
    isDestructive: {
      control: 'boolean',
    },
  },
  render: (args) => ({
    components: {
      ConfirmDialogPlayground,
    },
    setup: () => ({
      args,
    }),
    template: '<ConfirmDialogPlayground v-bind="args" />',
  }),
}

export const Scrollable: StoryObj<typeof DialogScrollablePlayground> = {
  args: {
    preventClickOutside: false,
    preventEsc: false,
    size: 'md',
  },
  render: (args) => ({
    components: {
      DialogScrollablePlayground,
    },
    setup: () => ({
      args,
    }),
    template: '<DialogScrollablePlayground v-bind="args" />',
  }),
}
