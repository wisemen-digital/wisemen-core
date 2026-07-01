import type { DefaultTheme } from 'vitepress'

import { getPackagesNavigation } from './navigation.utils'
import { DOC_PATHS } from './paths'

function createStacksNav(): DefaultTheme.NavItemWithChildren {
  return {
    text: 'Stacks',
    items: [
      {
        text: 'WEB',
        link: DOC_PATHS.web,
      },
      {
        text: 'API',
        link: DOC_PATHS.api,
      },
    ],
  }
}

export function createHomeNavigation(): DefaultTheme.NavItem[] {
  return [
    createStacksNav(),
  ]
}

export function createWebNavigation(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Playbook',
      link: DOC_PATHS.webPlaybook,
    },
    {
      text: 'Packages',
      items: getPackagesNavigation(),
    },
    createStacksNav(),
  ]
}

export function createApiNavigation(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Playbook',
      link: DOC_PATHS.apiPlaybook,
    },
    createStacksNav(),
  ]
}
