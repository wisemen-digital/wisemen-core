export function getStack(route: string): 'api' | 'web' | null {
  if (route.includes('/docs/api/')) {
    return 'api'
  }

  if (route.includes('/docs/web/')) {
    return 'web'
  }

  return null
}

export function isWebRoute(route: string): boolean {
  return getStack(route) === 'web'
}

export function isApiRoute(route: string): boolean {
  return getStack(route) === 'api'
}
