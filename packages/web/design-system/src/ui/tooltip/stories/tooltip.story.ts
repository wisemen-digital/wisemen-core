import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  screen,
  userEvent,
  within,
} from 'storybook/test'

import TooltipPlayground from './TooltipPlayground.vue'
import TooltipSidesPlayground from './TooltipSidesPlayground.vue'
import TooltipVariantsPlayground from './TooltipVariantsPlayground.vue'

const meta: Meta<typeof TooltipPlayground> = {
  title: 'Components/Tooltip',
  argTypes: {
    isDisabled: {
      control: 'boolean',
      description: 'When true, the tooltip will be hidden',
    },
    isPopoverArrowVisible: {
      control: 'boolean',
      description: 'Controls the visibility of the popper arrow',
    },
    delayDuration: {
      control: 'number',
      description: 'The duration in milliseconds to wait before showing the tooltip',
    },
    disableCloseOnTriggerClick: {
      control: 'boolean',
      description: 'When true, clicking on trigger won\'t close the tooltip',
    },
    disableHoverableContent: {
      control: 'boolean',
      description: 'When true, hovering the content will close the tooltip as the pointer leaves the trigger',
    },
    popoverAlign: {
      control: 'select',
      description: 'Defines how the content is aligned relative to the trigger',
      options: [
        'center',
        'end',
        'start',
      ],
    },
    popoverSide: {
      control: 'select',
      description: 'Defines which side the content should appear on',
      options: [
        'bottom',
        'left',
        'right',
        'top',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: TooltipPlayground,
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const trigger = canvas.getByText('Hover me')

    await userEvent.hover(trigger)

    const tooltip = await screen.findAllByText('What a beautiful tooltip!')

    await expect(tooltip[0]).toBeVisible()

    await userEvent.unhover(trigger)
  },
}

export const KeyboardFocus: Story = {
  play: async () => {
    await userEvent.tab()

    const tooltip = await screen.findAllByText('What a beautiful tooltip!')

    await expect(tooltip[0]).toBeVisible()
  },
}

export const AllSides: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Top')).toBeVisible()
    await expect(canvas.getByText('Right')).toBeVisible()
    await expect(canvas.getByText('Bottom')).toBeVisible()
    await expect(canvas.getByText('Left')).toBeVisible()
  },
  render: (args) => ({
    components: {
      TooltipSidesPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TooltipSidesPlayground v-bind="args" />',
  }),
}

export const Variants: Story = {
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const triggers = canvas.getAllByText('Hover me')

    await userEvent.hover(triggers[0]!)

    const title = await screen.findAllByText('What a beautiful tooltip!')

    await expect(title[0]).toBeVisible()
  },
  render: (args) => ({
    components: {
      TooltipVariantsPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TooltipVariantsPlayground v-bind="args" />',
  }),
}
