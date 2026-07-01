import type { DefaultTheme } from 'vitepress'

export const API_PLAYBOOK_NAVIGATION: DefaultTheme.SidebarItem = {
  text: 'API Playbook',
  items: [
    {
      text: 'Overview',
      link: '/api/playbook/',
    },
    {
      text: 'Example page',
      link: '/api/playbook/example-page',
    },
  ],
}
