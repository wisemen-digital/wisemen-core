import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import ToastCustomDurationPlayground from './ToastCustomDurationPlayground.vue'
import ToastDefaultPlayground from './ToastDefaultPlayground.vue'
import ToastInteractablePlayground from './ToastInteractablePlayground.vue'
import ToastNotDismissiblePlayground from './ToastNotDismissiblePlayground.vue'
import ToastVariantsPlayground from './ToastVariantsPlayground.vue'
import ToastWithTitlePlayground from './ToastWithTitlePlayground.vue'

const meta = {
  title: 'Components/Toast',
  tags: [
    'autodocs',
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      ToastDefaultPlayground,
    },
    template: '<ToastDefaultPlayground />',
  }),
}

export const WithTitle: Story = {
  render: () => ({
    components: {
      ToastWithTitlePlayground,
    },
    template: '<ToastWithTitlePlayground />',
  }),
}

export const WithVariant: Story = {
  render: () => ({
    components: {
      ToastVariantsPlayground,
    },
    template: '<ToastVariantsPlayground />',
  }),
}

export const NotDismissible: Story = {
  render: () => ({
    components: {
      ToastNotDismissiblePlayground,
    },
    template: '<ToastNotDismissiblePlayground />',
  }),
}

export const WithCustomDuration: Story = {
  render: () => ({
    components: {
      ToastCustomDurationPlayground,
    },
    template: '<ToastCustomDurationPlayground />',
  }),
}

export const WithInteractableModels: Story = {
  render: () => ({
    components: {
      ToastInteractablePlayground,
    },
    template: '<ToastInteractablePlayground />',
  }),
}
