export class RedirectValidator {
  private allowedPaths: string[]
  private blockedPaths: string[]

  constructor(config: {
    allowedPaths?: string[]
    blockedPaths?: string[]
  }) {
    this.allowedPaths = config.allowedPaths || []
    this.blockedPaths = config.blockedPaths || []
  }

  private normalizeRedirectUrl(redirectUrl: string): {
    pathname: string
    redirectPath: string
  } | null {
    if (!redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) {
      return null
    }

    try {
      const parsedRedirectUrl = new URL(redirectUrl, 'https://wisemen-auth.local')

      if (parsedRedirectUrl.origin !== 'https://wisemen-auth.local') {
        return null
      }

      return {
        pathname: parsedRedirectUrl.pathname,
        redirectPath: `${parsedRedirectUrl.pathname}${parsedRedirectUrl.search}${parsedRedirectUrl.hash}`,
      }
    }
    catch {
      return null
    }
  }

  private matchesPath(path: string, candidate: string): boolean {
    if (candidate.endsWith('/*')) {
      const prefix = candidate.slice(0, -1)

      return path.startsWith(prefix)
    }

    return path === candidate || path.startsWith(`${candidate}/`)
  }

  private isBlockedPath(pathname: string): boolean {
    return this.blockedPaths.some((blockedPath) => this.matchesPath(pathname, blockedPath))
  }

  private isValidPath(pathname: string, redirectPath: string): boolean {
    if (this.allowedPaths.length === 0) {
      return true
    }

    return this.allowedPaths.some((allowedPath) => {
      if (this.matchesPath(pathname, allowedPath)) {
        return true
      }

      if (allowedPath.includes('?') || allowedPath.includes('#')) {
        return redirectPath === allowedPath
      }

      return false
    })
  }

  /**
   * Validates if a redirect URL is safe to use
   * @param redirectUrl - The URL to validate (should be relative path)
   * @returns boolean indicating if the URL is safe
   */
  public isValidRedirectUrl(redirectUrl: string): boolean {
    const normalizedRedirectUrl = this.normalizeRedirectUrl(redirectUrl)

    if (normalizedRedirectUrl === null) {
      return false
    }

    if (this.isBlockedPath(normalizedRedirectUrl.pathname)) {
      return false
    }

    return this.isValidPath(
      normalizedRedirectUrl.pathname,
      normalizedRedirectUrl.redirectPath,
    )
  }

  /**
   * Sanitizes a redirect URL by ensuring it's safe
   * Returns the URL if valid, or a fallback URL if invalid
   */
  public sanitizeRedirectUrl(
    redirectUrl: string | null,
    fallbackUrl: string = '/',
  ): string {
    const safeFallbackUrl = this.isValidRedirectUrl(fallbackUrl) ? fallbackUrl : '/'

    if (!redirectUrl || !this.isValidRedirectUrl(redirectUrl)) {
      return safeFallbackUrl
    }

    return redirectUrl
  }
}
