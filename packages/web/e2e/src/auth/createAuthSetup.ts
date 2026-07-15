import type { Page } from '@playwright/test'

import { FormTestUtil } from '@/page-objects/form.page-object'

export interface AuthSetupOptions {
  /** OIDC authorize URL pattern to intercept (e.g., 'https://test-oidc.example.com/oauth/v2/authorize**') */
  authorizeUrlPattern: string
  /** Callback URL base (e.g., 'http://localhost:4000/auth/callback') */
  callbackUrl: string
  /** Login page URL (default: '/auth/login') */
  loginUrl?: string
  /**
   * Custom login steps. Called after navigating to the login page.
   * The FormTestUtil is scoped to the page's form.
   */
  performLogin: (page: Page, form: FormTestUtil) => Promise<void>
  /** Path to save storage state (e.g., 'tests/.auth/user.json') */
  storageStatePath: string
  /**
   * Optional assertion after auth completes.
   * Called after storage state is saved.
   */
  verifyAuth?: (page: Page) => Promise<void>
}

/**
 * Creates a reusable authentication function for Playwright e2e tests.
 *
 * The factory handles the OIDC redirect interception and storage state saving,
 * while you provide the app-specific login steps (filling forms, submitting, etc.)
 *
 * @example
 * ```ts
 * const authenticate = createAuthSetup({
 *   authorizeUrlPattern: 'https://test-oidc.example.com/oauth/v2/authorize**',
 *   callbackUrl: 'http://localhost:4000/auth/callback',
 *   storageStatePath: 'tests/.auth/user.json',
 *   performLogin: async (page, form) => {
 *     const username = form.getTextFieldByLabel('Username')
 *     await username.fill('test@example.com')
 *     await form.submit()
 *   },
 * })
 *
 * test('authenticate', async ({ page }) => {
 *   await authenticate(page)
 * })
 * ```
 */
export function createAuthSetup(options: AuthSetupOptions): (page: Page) => Promise<void> {
  const {
    authorizeUrlPattern,
    callbackUrl,
    loginUrl = '/auth/login',
    performLogin,
    storageStatePath,
    verifyAuth,
  } = options

  return async (page: Page): Promise<void> => {
    // 1. Intercept OIDC authorize endpoint and redirect with a mock authorization code
    await page.route(authorizeUrlPattern, async (route) => {
      const url = new URL(route.request().url())
      const state = url.searchParams.get('state')

      await route.fulfill({
        body: '',
        headers: {
          location: `${callbackUrl}?code=${crypto.randomUUID()}&state=${state}`,
        },
        status: 302,
      })
    })

    // 2. Navigate to the login page
    await page.goto(loginUrl)

    // 3. Run the app-specific login steps
    const form = new FormTestUtil(page)

    await performLogin(page, form)

    // 4. Save the browser's storage state (cookies, localStorage, etc.)
    await page.context().storageState({
      path: storageStatePath,
    })

    // 5. Optionally verify the auth was successful
    if (verifyAuth != null) {
      await verifyAuth(page)
    }
  }
}
