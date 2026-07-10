export function getStack(route: string): 'api' | 'cms' | 'web' | null {
  if (route.includes('/docs/api/')) {
    return 'api'
  }

  if (route.includes('/docs/web/')) {
    return 'web'
  }

  if (route.includes('/docs/cms/')) {
    return 'cms'
  }

  return null
}

export function isWebRoute(route: string): boolean {
  return getStack(route) === 'web'
}

export function isApiRoute(route: string): boolean {
  return getStack(route) === 'api'
}

export function isCmsRoute(route: string): boolean {
  return getStack(route) === 'cms'
}
