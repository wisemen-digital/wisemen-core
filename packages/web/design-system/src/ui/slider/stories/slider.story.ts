import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import SliderPlayground from './SliderPlayground.vue'
import SliderRangePlayground from './SliderRangePlayground.vue'
import SliderStatesPlayground from './SliderStatesPlayground.vue'

const meta = {
  title: 'Components/Slider',
  argTypes: {
    errorMessage: {
      control: 'text',
      description: 'The error message to display',
    },
    hint: {
      control: 'text',
      description: 'The hint text of the slider',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the slider is required',
    },
    label: {
      control: 'text',
      description: 'The label of the slider',
    },
    max: {
      control: 'number',
      description: 'The maximum value',
    },
    min: {
      control: 'number',
      description: 'The minimum value',
    },
    showValueLabels: {
      control: 'boolean',
      description: 'Whether to show value labels below each thumb',
    },
    size: {
      control: 'select',
      description: 'The size of the slider',
      options: [
        'md',
        'sm',
      ],
    },
    step: {
      control: 'number',
      description: 'The stepping interval',
    },
  },
  tags: [
    'autodocs',
  ],
  component: SliderPlayground,
} satisfies Meta<typeof SliderPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Slider Label',
    max: 100,
    min: 0,
    showValueLabels: false,
    size: 'md',
    step: 1,
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const thumb = canvas.getByRole('slider')

    await expect(thumb).toBeInTheDocument()
    await expect(thumb).not.toBeDisabled()

    thumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(Number(thumb.getAttribute('aria-valuenow'))).toBeGreaterThan(50)
  },
}

export const WithValueLabels: Story = {
  args: {
    label: 'Slider Label',
    showValueLabels: true,
  },
}

export const AllStates: Story = {
  render: (args) => ({
    components: {
      SliderStatesPlayground,
    },
    setup() {
      return { args }
    },
    template: '<SliderStatesPlayground v-bind="args" />',
  }),
}

export const Range: Story = {
  render: (args) => ({
    components: {
      SliderRangePlayground,
    },
    setup() {
      return { args }
    },
    template: '<SliderRangePlayground v-bind="args" />',
  }),
}
