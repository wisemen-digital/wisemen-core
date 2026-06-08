import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import AvatarFallbackPlayground from '@/ui/avatar/avatar/stories/AvatarFallbackPlayground.vue'
import AvatarImagePlayground from '@/ui/avatar/avatar/stories/AvatarImagePlayground.vue'
import AvatarLogoPlayground from '@/ui/avatar/avatar/stories/AvatarLogoPlayground.vue'
import AvatarStatusPlayground from '@/ui/avatar/avatar/stories/AvatarStatusPlayground.vue'

const meta = {
  title: 'Components/Avatar',
  tags: [
    'autodocs',
  ],
  component: AvatarImagePlayground,
} satisfies Meta<typeof AvatarImagePlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Fallback: Story = {
  render: () => ({
    components: {
      AvatarFallbackPlayground,
    },
    template: '<AvatarFallbackPlayground />',
  }),
}

export const Status: Story = {
  render: () => ({
    components: {
      AvatarStatusPlayground,
    },
    template: '<AvatarStatusPlayground />',
  }),
}

export const WithLogo: Story = {
  render: () => ({
    components: {
      AvatarLogoPlayground,
    },
    template: '<AvatarLogoPlayground />',
  }),
}
