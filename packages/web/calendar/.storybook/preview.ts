import './style.css'

import type { Preview } from '@storybook/vue3-vite'
import type { VNode } from 'vue'
import { h } from 'vue'

import StoryWrapper from './StoryWrapper.vue'

const preview: Preview = {
  decorators: [
    (story): VNode => h(StoryWrapper, null, () => h(story())),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
