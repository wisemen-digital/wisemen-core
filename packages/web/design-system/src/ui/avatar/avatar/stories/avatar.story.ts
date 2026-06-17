import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import AvatarFallbackPlayground from '@/ui/avatar/avatar/stories/AvatarFallbackPlayground.vue'
import AvatarLogoPlayground from '@/ui/avatar/avatar/stories/AvatarLogoPlayground.vue'
import AvatarPlayground from '@/ui/avatar/avatar/stories/AvatarPlayground.vue'
import AvatarSizesPlayground from '@/ui/avatar/avatar/stories/AvatarSizesPlayground.vue'
import AvatarStatusPlayground from '@/ui/avatar/avatar/stories/AvatarStatusPlayground.vue'

const meta = {
  title: 'Components/Avatar',
  argTypes: {
    size: {
      control: 'select',
      description: 'Controls the size of the avatar',
      options: [
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: AvatarPlayground,
} satisfies Meta<typeof AvatarPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
  },
}

export const AllSizes: Story = {
  parameters: {
    controls: {
      exclude: [
        'size',
      ],
    },
  },
  render: () => ({
    components: {
      AvatarSizesPlayground,
    },
    template: '<AvatarSizesPlayground />',
  }),
}

export const Fallback: Story = {
  render: (args) => ({
    components: {
      AvatarFallbackPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<AvatarFallbackPlayground v-bind="args" />',
  }),
}

export const Status: Story = {
  render: (args) => ({
    components: {
      AvatarStatusPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<AvatarStatusPlayground v-bind="args" />',
  }),
}

export const WithLogo: Story = {
  render: (args) => ({
    components: {
      AvatarLogoPlayground,
    },
    setup() {
      return {
        args,
      }
    },
    template: '<AvatarLogoPlayground v-bind="args" />',
  }),
}
