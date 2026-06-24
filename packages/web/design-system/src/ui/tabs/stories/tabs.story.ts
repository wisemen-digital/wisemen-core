import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  userEvent,
  within,
} from 'storybook/test'

import TabsOverflowPlayground from './TabsOverflowPlayground.vue'
import TabsPlayground from './TabsPlayground.vue'
import TabsRouterLinkOverflowPlayground from './TabsRouterLinkOverflowPlayground.vue'
import TabsRouterLinkPlayground from './TabsRouterLinkPlayground.vue'

const DISABLED_REGEX = /Disabled/i

const meta = {
  title: 'Components/Tabs',
  argTypes: {
    isFullWidth: {
      control: 'boolean',
      description: 'Makes each tab grow to fill the available horizontal space',
    },
    orientation: {
      control: 'select',
      description: 'Arranges the tab list horizontally or vertically',
      options: [
        'horizontal',
        'vertical',
      ],
    },
    underlineTabsHorizontalListPadding: {
      control: 'select',
      description: 'Controls the horizontal padding used by underline tab lists',
      options: [
        'none',
        'sm',
        'md',
        'lg',
        'xl',
      ],
    },
    variant: {
      control: 'select',
      description: 'Visual style used for the tab triggers',
      options: [
        'underline',
        'button-border',
        'button-brand',
      ],
    },
  },

  tags: [
    'autodocs',
  ],
  component: TabsPlayground,
} satisfies Meta<typeof TabsPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Underline: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'underline',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)

    const tabs = canvas.getAllByRole('tab')

    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

    await expect(canvas.getByText('General content goes here.')).toBeVisible()

    await userEvent.click(tabs[1]!)

    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'false')

    await expect(canvas.getByText('Members content goes here.')).toBeVisible()

    const disabledTab = canvas.getByRole('tab', {
      name: DISABLED_REGEX,
    })

    await expect(disabledTab).toBeDisabled()
  },
}

export const ButtonBorder: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'button-border',
  },
}

export const ButtonBrand: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'button-brand',
  },
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    variant: 'underline',
  },
}

export const FullWidth: Story = {
  args: {
    isFullWidth: true,
    orientation: 'horizontal',
    variant: 'underline',
  },
}

export const Overflow: Story = {
  args: {
    variant: 'underline',
  },
  render: (args) => ({
    components: {
      TabsOverflowPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TabsOverflowPlayground v-bind="args" />',
  }),
}

export const RouterLink: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'underline',
  },
  render: (args) => ({
    components: {
      TabsRouterLinkPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TabsRouterLinkPlayground v-bind="args" />',
  }),
}

export const RouterLinkOverflow: Story = {
  args: {
    variant: 'underline',
  },
  render: (args) => ({
    components: {
      TabsRouterLinkOverflowPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<TabsRouterLinkOverflowPlayground v-bind="args" />',
  }),
}
