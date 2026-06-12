import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'
import {
  expect,
  within,
} from 'storybook/test'

import BaseHeaderAllVariantsPlayground from './BaseHeaderAllVariantsPlayground.vue'
import BaseHeaderPlayground from './BaseHeaderPlayground.vue'

const leftVariantOptions = [
  'none',
  'icon',
  'featured-icon',
  'avatar',
  'dot',
  'logo',
] as const

const meta = {
  title: 'Components/BaseHeader',
  argTypes: {
    title: {
      control: 'text',
      description: 'Primary heading text.',
    },
    hasActions: {
      control: 'boolean',
      description: 'Shows the actions slot with primary and icon actions.',
    },
    hasSubtitle: {
      control: 'boolean',
      description: 'Shows the subtitle slot below the title.',
    },
    hasTitleEnd: {
      control: 'boolean',
      description: 'Shows the title-end slot beside the title.',
    },
    leftVariant: {
      control: 'select',
      description: 'Leading visual rendered through the BaseHeader left config.',
      options: leftVariantOptions,
    },
  },
  tags: [
    'autodocs',
  ],
  component: BaseHeaderPlayground,
} satisfies Meta<typeof BaseHeaderPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Project settings',
  },
  play: async ({
    canvasElement,
  }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', {
      name: 'Project settings',
    })

    await expect(heading).toBeInTheDocument()
  },
}

export const WithSubtitle: Story = {
  args: {
    title: 'Project settings',
    hasSubtitle: true,
  },
}

export const WithTitleEnd: Story = {
  args: {
    title: 'Project settings',
    hasTitleEnd: true,
  },
}

export const WithActions: Story = {
  args: {
    title: 'Project settings',
    hasActions: true,
  },
}

export const Icon: Story = {
  args: {
    title: 'Project settings',
    leftVariant: 'icon',
  },
}

export const FeaturedIcon: Story = {
  args: {
    title: 'Project settings',
    hasSubtitle: true,
    leftVariant: 'featured-icon',
  },
}

export const Avatar: Story = {
  args: {
    title: 'Project settings',
    leftVariant: 'avatar',
  },
}

export const Dot: Story = {
  args: {
    title: 'Project settings',
    leftVariant: 'dot',
  },
}

export const Logo: Story = {
  args: {
    title: 'Project settings',
    leftVariant: 'logo',
  },
}

export const Complete: Story = {
  args: {
    title: 'Project settings',
    hasActions: true,
    hasSubtitle: true,
    hasTitleEnd: true,
    leftVariant: 'featured-icon',
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: {
      BaseHeaderAllVariantsPlayground,
    },
    template: '<BaseHeaderAllVariantsPlayground />',
  }),
}
