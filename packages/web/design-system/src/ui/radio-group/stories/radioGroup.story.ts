import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import RadioGroupCardPlayground from './RadioGroupCardPlayground.vue'
import RadioGroupPlayground from './RadioGroupPlayground.vue'

const meta = {
  title: 'Components/RadioGroup',
  argTypes: {
    isDisabled: {
      control: 'boolean',
    },
    orientation: {
      control: 'select',
      options: [
        'horizontal',
        'vertical',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: RadioGroupPlayground,
} satisfies Meta<typeof RadioGroupPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isDisabled: false,
    orientation: 'vertical',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const radios = canvas.getAllByRole('radio')

    await expect(radios).toHaveLength(3)

    for (const radio of radios) {
      await expect(radio).not.toBeChecked()
    }

    await userEvent.click(radios[0]!)

    await expect(radios[0]).toBeChecked()

    await userEvent.click(radios[1]!)

    await expect(radios[0]).not.toBeChecked()
    await expect(radios[1]).toBeChecked()
  },
}

export const Horizontal: Story = {
  args: {
    isDisabled: false,
    orientation: 'horizontal',
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    orientation: 'vertical',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const radios = canvas.getAllByRole('radio')

    for (const radio of radios) {
      await expect(radio).toBeDisabled()
    }
  },
}

export const CardVariant: Story = {
  args: {
    isDisabled: false,
    orientation: 'vertical',
  },
  render: (args) => ({
    components: {
      RadioGroupCardPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<RadioGroupCardPlayground v-bind="args" />',
  }),
}
