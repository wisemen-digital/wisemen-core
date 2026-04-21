import type { DefaultTheme } from 'vitepress'

import { PACKAGE_DOC_NAVIGATION } from './navigation.router'

export interface PackageDocNavigation {
  title: string
  link: string
  sidebar: DefaultTheme.SidebarItem[]
  path: string
}

export type NavItem = (DefaultTheme.NavItemChildren | DefaultTheme.NavItemComponent | DefaultTheme.NavItemWithLink)

function toFullPackagePath({
  path, link,
}: {
  link: string
  path: string
}): string {
  return `/packages/${path}/${link}`
}

function sidebarItemToFullPath(item: DefaultTheme.SidebarItem, packagePath: string): DefaultTheme.SidebarItem {
  return {
    ...item,
    link: item.link
      ? toFullPackagePath({
          path: packagePath,
          link: item.link,
        })
      : undefined,
    items: item.items?.map((subItem) => sidebarItemToFullPath(subItem, packagePath)),
  }
}

export function getPackagesNavigation(): NavItem[] {
  return PACKAGE_DOC_NAVIGATION.map((group) => ({
    text: group.text,
    items: group.items.map((pkg) => ({
      text: pkg.title,
      link: toFullPackagePath(pkg),
    })),
  }))
}

export function getPackagesSidebar(): DefaultTheme.SidebarMulti {
  const transformedSidebar = PACKAGE_DOC_NAVIGATION.reduce((acc, group) => {
    for (const pkg of group.items) {
      const packagePath = `packages/${pkg.path}`

      acc[packagePath] = pkg.sidebar.map((item) => sidebarItemToFullPath(item, pkg.path))
    }

    return acc
  }, {} as DefaultTheme.SidebarMulti)

  return transformedSidebar
}
