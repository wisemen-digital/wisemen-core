import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import SwitchPlayground from './SwitchPlayground.vue'
import SwitchSizesPlayground from './SwitchSizesPlayground.vue'
import SwitchStatesPlayground from './SwitchStatesPlayground.vue'
import SwitchWithIconsPlayground from './SwitchWithIconsPlayground.vue'

const meta = {
  title: 'Components/Switch',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the switch is required',
    },
    errorMessage: {
      control: 'text',
      description: 'The error message to display',
    },
    hint: {
      control: 'text',
      description: 'The hint text of the switch',
    },
    label: {
      control: 'text',
      description: 'The label of the switch',
    },
    size: {
      control: 'select',
      description: 'The size of the switch',
      options: [
        'md',
        'sm',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: SwitchPlayground,
} satisfies Meta<typeof SwitchPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Switch Label',
    size: 'md',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const switchElement = canvas.getByRole('switch')

    await expect(switchElement).not.toBeChecked()

    await userEvent.click(switchElement)

    await expect(switchElement).toBeChecked()

    await userEvent.click(switchElement)

    await expect(switchElement).not.toBeChecked()
  },
}

export const AllStates: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const switches = canvas.getAllByRole('switch')

    const disabledSwitches = switches.filter(
      (s) => (s as HTMLButtonElement).disabled,
    )

    for (const s of disabledSwitches) {
      await expect(s).toBeDisabled()
    }
  },
  render: (args) => ({
    components: {
      SwitchStatesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<SwitchStatesPlayground v-bind="args" />',
  }),
}

export const AllSizes: Story = {
  render: (args) => ({
    components: {
      SwitchSizesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<SwitchSizesPlayground v-bind="args" />',
  }),
}

export const WithIcons: Story = {
  render: (args) => ({
    components: {
      SwitchWithIconsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<SwitchWithIconsPlayground v-bind="args" />',
  }),
}
