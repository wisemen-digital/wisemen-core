import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import FieldGroupPlayground from './FieldGroupPlayground.vue'
import FormFieldSetPlayground from './FormFieldSetPlayground.vue'

const meta = {
  title: 'Components/Form/Layout',
  tags: [
    'autodocs',
  ],
  component: FieldGroupPlayground,
} satisfies Meta<typeof FieldGroupPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FieldSet: Story = {
  render: () => ({
    components: {
      FormFieldSetPlayground,
    },
    template: '<FormFieldSetPlayground />',
  }),
}
