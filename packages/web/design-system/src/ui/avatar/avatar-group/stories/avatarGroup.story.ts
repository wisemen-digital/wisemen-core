import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import AvatarGroupFallbackPlayground from '@/ui/avatar/avatar-group/stories/AvatarGroupFallbackPlayground.vue'
import AvatarGroupPlayground from '@/ui/avatar/avatar-group/stories/AvatarGroupPlayground.vue'
import AvatarGroupWithAddButtonPlayground from '@/ui/avatar/avatar-group/stories/AvatarGroupWithAddButtonPlayground.vue'

const meta = {
  title: 'Components/Avatar Group',
  tags: [
    'autodocs',
  ],
  component: AvatarGroupPlayground,
} satisfies Meta<typeof AvatarGroupPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Fallback: Story = {
  render: () => ({
    components: {
      AvatarGroupFallbackPlayground,
    },
    template: '<AvatarGroupFallbackPlayground />',
  }),
}

export const WithAddButton: Story = {
  render: () => ({
    components: {
      AvatarGroupWithAddButtonPlayground,
    },
    template: '<AvatarGroupWithAddButtonPlayground />',
  }),
}
