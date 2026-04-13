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

  private isBlockedPath(path: string): boolean {
    // Extract just the pathname part (remove query string for checking)
    const pathname = path.split('?')[0]

    return this.blockedPaths.some((blockedPath) => {
      if (blockedPath.endsWith('/*')) {
        const prefix = blockedPath.slice(0, -1) // Remove *

        return pathname.startsWith(prefix)
      }

      return pathname === blockedPath || pathname.startsWith(`${blockedPath}/`)
    })
  }

  private isValidPath(path: string): boolean {
    if (this.allowedPaths.length === 0) {
      return true
    }

    return this.allowedPaths.some((allowedPath) => {
      // Exact match
      if (path === allowedPath) {
        return true
      }

      // Prefix match (if allowed path ends with /*)
      if (allowedPath.endsWith('/*')) {
        const prefix = allowedPath.slice(0, -1) // Remove *

        return path.startsWith(prefix)
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
    try {
      // Only allow relative URLs that start with /
      if (!redirectUrl.startsWith('/')) {
        return false
      }

      // Block dangerous paths first
      if (this.isBlockedPath(redirectUrl)) {
        return false
      }

      // If allowedPaths is specified, check against whitelist
      if (this.allowedPaths.length > 0) {
        return this.isValidPath(redirectUrl)
      }

      // If no specific allowed paths, allow all except blocked ones
      return true
    }
    catch {
      // Invalid URL format
      return false
    }
  }

  /**
   * Sanitizes a redirect URL by ensuring it's safe
   * Returns the URL if valid, or a fallback URL if invalid
   */
  public sanitizeRedirectUrl(
    redirectUrl: string | null,
    fallbackUrl: string = '/',
  ): string {
    if (!redirectUrl || !this.isValidRedirectUrl(redirectUrl)) {
      return fallbackUrl
    }

    return redirectUrl
  }
}
