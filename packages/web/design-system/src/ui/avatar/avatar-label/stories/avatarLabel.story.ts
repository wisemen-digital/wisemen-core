import type {
  Meta,
  StoryObj,
} from '@storybook/vue3-vite'

import AvatarLabelResponsivePlayground from '@/ui/avatar/avatar-label/stories/AvatarLabelResponsivePlayground.vue'
import AvatarLabelSizesPlayground from '@/ui/avatar/avatar-label/stories/AvatarLabelSizesPlayground.vue'
import AvatarLabelVariantsPlayground from '@/ui/avatar/avatar-label/stories/AvatarLabelVariantsPlayground.vue'

const meta = {
  title: 'Components/Avatar Label',
  tags: [
    'autodocs',
  ],
  component: AvatarLabelSizesPlayground,
} satisfies Meta<typeof AvatarLabelSizesPlayground>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Responsive: Story = {
  render: () => ({
    components: {
      AvatarLabelResponsivePlayground,
    },
    template: '<AvatarLabelResponsivePlayground />',
  }),
}

export const Variants: Story = {
  render: () => ({
    components: {
      AvatarLabelVariantsPlayground,
    },
    template: '<AvatarLabelVariantsPlayground />',
  }),
}
