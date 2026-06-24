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
const CALENDAR_REGEX = /calendar/i
const HIDDEN_TABS_BUTTON_REGEX = /open hidden tabs/i
const SETTINGS_REGEX = /settings/i
const SUPPORT_REGEX = /support/i

async function waitForOverflowLayout(): Promise<void> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 100)
  })
}

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
    overflowBehavior: {
      control: 'select',
      description: 'Controls whether overflowing tabs collapse into a dropdown or remain scrollable',
      options: [
        'scroll',
        'scroll',
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

export const ResponsiveOverflow: Story = {
  args: {
    overflowBehavior: 'scroll',
    variant: 'underline',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const container = canvasElement.querySelector('[data-testid="tabs-overflow-container"]') as HTMLElement | null

    if (container === null) {
      throw new Error('Overflow container not found')
    }

    container.style.width = '20rem'
    await waitForOverflowLayout()

    await expect(canvas.getByRole('button', {
      name: HIDDEN_TABS_BUTTON_REGEX,
    })).toBeVisible()
    await expect(canvas.queryByRole('tab', {
      name: SETTINGS_REGEX,
    })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', {
      name: HIDDEN_TABS_BUTTON_REGEX,
    }))
    await userEvent.click(await body.findByRole('menuitem', {
      name: SETTINGS_REGEX,
    }))

    await expect(canvas.getByText('Settings content goes here.')).toBeVisible()
    await expect(canvas.getByRole('tab', {
      name: SETTINGS_REGEX,
    })).toBeVisible()

    container.style.width = '72rem'
    await waitForOverflowLayout()

    await expect(canvas.queryByRole('button', {
      name: HIDDEN_TABS_BUTTON_REGEX,
    })).not.toBeInTheDocument()
    await expect(canvas.getByRole('tab', {
      name: SUPPORT_REGEX,
    })).toBeVisible()
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

export const ScrollOverflow: Story = {
  args: {
    overflowBehavior: 'scroll',
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
    overflowBehavior: 'scroll',
    variant: 'underline',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const container = canvasElement.querySelector('[data-testid="tabs-router-overflow-container"]') as HTMLElement | null

    if (container === null) {
      throw new Error('Router overflow container not found')
    }

    container.style.width = '20rem'
    await waitForOverflowLayout()

    await expect(canvas.getByRole('button', {
      name: HIDDEN_TABS_BUTTON_REGEX,
    })).toBeVisible()
    await expect(canvas.queryByRole('tab', {
      name: CALENDAR_REGEX,
    })).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', {
      name: HIDDEN_TABS_BUTTON_REGEX,
    }))
    await userEvent.click(await body.findByRole('menuitem', {
      name: CALENDAR_REGEX,
    }))

    await expect(canvas.getByText('Calendar content goes here.')).toBeVisible()
    await expect(canvas.getByRole('tab', {
      name: CALENDAR_REGEX,
    })).toBeVisible()

    container.style.width = '72rem'
    await waitForOverflowLayout()

    await expect(canvas.queryByRole('button', {
      name: HIDDEN_TABS_BUTTON_REGEX,
    })).not.toBeInTheDocument()
    await expect(canvas.getByRole('tab', {
      name: SUPPORT_REGEX,
    })).toBeVisible()
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
