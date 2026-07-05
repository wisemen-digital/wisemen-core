import type { DefaultTheme } from 'vitepress'

import { API_PACKAGES_NAVIGATION } from '#stacks/api/api.router.ts'
import { CMS_PACKAGES_NAVIGATION } from '#stacks/cms/cms.router.ts'
import { PACKAGE_DOC_NAVIGATION } from '#stacks/web/web.router.ts'

export interface PackageDocNavigation {
  title: string
  link: string
  sidebar: DefaultTheme.SidebarItem[]
  path: string
}

export interface PackageDocNavigationGroup {
  items: PackageDocNavigation[]
  text: string
}

export type StackKey = 'api' | 'cms' | 'web'

export type NavItem = DefaultTheme.NavItemChildren | DefaultTheme.NavItemWithLink

interface StackConfig {
  groups: PackageDocNavigationGroup[]
  key: StackKey
  packageRootPath: string
}

const STACK_CONFIGS: Record<StackKey, StackConfig> = {
  api: {
    groups: API_PACKAGES_NAVIGATION,
    key: 'api',
    packageRootPath: '/api/packages/',
  },
  cms: {
    groups: CMS_PACKAGES_NAVIGATION,
    key: 'cms',
    packageRootPath: '/cms/packages/',
  },
  web: {
    groups: PACKAGE_DOC_NAVIGATION,
    key: 'web',
    packageRootPath: '/web/packages/',
  },
}

function trimSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, '')
}

function joinDocPath(...parts: string[]): string {
  const normalizedParts = parts
    .map((part) => trimSlashes(part))
    .filter(Boolean)

  return `/${normalizedParts.join('/')}`
}

function toPackageBasePath(stack: StackConfig, pkg: PackageDocNavigation): string {
  return joinDocPath(stack.packageRootPath, pkg.path)
}

function mapSidebarItemLinks(
  item: DefaultTheme.SidebarItem,
): DefaultTheme.SidebarItem {
  return {
    ...item,
    link: item.link,
    items: item.items?.map((childItem) => mapSidebarItemLinks(childItem)),
  }
}

function createPackageSidebars(stack: StackConfig): DefaultTheme.SidebarMulti {
  return stack.groups.reduce((sidebar, group) => {
    for (const pkg of group.items) {
      sidebar[`${toPackageBasePath(stack, pkg)}/`] = pkg.sidebar.map((item) => mapSidebarItemLinks(item))
    }

    return sidebar
  }, {} as DefaultTheme.SidebarMulti)
}

export function getPackagesNavigation(stackKey: StackKey = 'web'): NavItem[] {
  const stack = STACK_CONFIGS[stackKey]

  return stack.groups.map((group) => ({
    text: group.text,
    items: group.items.map((pkg) => ({
      text: pkg.title,
      link: pkg.link,
    })),
  }))
}

export function getPackagesSidebar(): DefaultTheme.SidebarMulti {
  return {
    ...createPackageSidebars(STACK_CONFIGS.api),
    ...createPackageSidebars(STACK_CONFIGS.cms),
    ...createPackageSidebars(STACK_CONFIGS.web),
  }
}
