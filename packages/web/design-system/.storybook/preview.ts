import '../src/styles/index.css'

import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { h } from 'vue'
import {
  createMemoryHistory,
  createRouter,
} from 'vue-router'

import { i18nPlugin } from '../src/plugins/i18n.plugin'
import StoryWrapper from './StoryWrapper.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/:catchAll(.*)',
      component: {
        template: '<div />',
      },
    },
  ],
})

setup((app) => {
  app.use(i18nPlugin)
  app.use(router)
})

const preview: Preview = {
  decorators: [

    (story, context) => {
      const theme = context.globals.theme || 'light'
      const locale = context.globals.locale || 'en-US'
      const hourCycle = context.globals.hourCycle || '24-hour'

      return () => h(StoryWrapper, {
        hourCycle,
        locale,
        theme,
      }, () => h(story()))
    },
  ],

  globalTypes: {
    hourCycle: {
      description: 'Hour cycle for time components',
      toolbar: {
        title: 'Hour cycle',
        dynamicTitle: true,
        icon: 'time',
        items: [
          {
            title: '12-hour',
            value: '12-hour',
          },
          {
            title: '24-hour',
            value: '24-hour',
          },
        ],
      },
    },
    locale: {
      description: 'Locale for components',
      toolbar: {
        title: 'Locale',
        dynamicTitle: true,
        icon: 'globe',
        items: [
          {
            title: 'English (US)',
            value: 'en-US',
          },
          {
            title: 'Dutch (BE)',
            value: 'nl-BE',
          },
          {
            title: 'French (BE)',
            value: 'fr-BE',
          },
        ],
      },
    },
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        dynamicTitle: true,
        icon: 'circlehollow',
        items: [
          {
            title: 'Light',
            icon: 'sun',
            value: 'light',
          },
          {
            title: 'Dark',
            icon: 'moon',
            value: 'dark',
          },
        ],
      },
    },
  },

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
