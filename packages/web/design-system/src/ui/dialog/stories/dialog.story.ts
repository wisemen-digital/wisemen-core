import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import ConfirmDialogPlayground from './ConfirmDialogPlayground.vue'
import DialogPlayground from './DialogPlayground.vue'
import DialogScrollablePlayground from './DialogScrollablePlayground.vue'
import FormDialogPlayground from './FormDialogPlayground.vue'

const meta = {
  title: 'Components/Dialog',
  argTypes: {
    isClickOutsideDisabled: {
      control: 'boolean',
    },
    isEscDisabled: {
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
    isClickOutsideDisabled: false,
    isEscDisabled: false,
    size: 'md',
  },
}

export const Confirm: StoryObj<typeof ConfirmDialogPlayground> = {
  args: {
    isDestructive: true,
    isClickOutsideDisabled: false,
    isEscDisabled: false,
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
    isClickOutsideDisabled: false,
    isEscDisabled: false,
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

export const Form: StoryObj<typeof FormDialogPlayground> = {
  render: (args) => ({
    components: {
      FormDialogPlayground,
    },
    setup: () => ({
      args,
    }),
    template: '<FormDialogPlayground v-bind="args" />',
  }),
}
