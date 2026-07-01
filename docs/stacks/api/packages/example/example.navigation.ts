import type { DefaultTheme } from 'vitepress'

export const EXAMPLE_NAVIGATION: DefaultTheme.NavItemWithChildren = {
  text: 'Packages',
  items: [
    {
      text: 'Overview',
      link: '/api/packages/example',
    },
  ],
}

export const EXAMPLE_SIDEBAR: DefaultTheme.SidebarItem = {
  text: 'API Packages',
  items: [
    {
      text: 'Overview',
      link: '/api/packages/example',
    },
  ],
}
