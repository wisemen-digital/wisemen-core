/* eslint-disable node/prefer-global/process */

/**
 * Determines whether the current environment is not production.
 * Reads `import.meta.env.ENVIRONMENT` (Vite) or falls back to `process.env.ENVIRONMENT`.
 */
export function isDevelopment(): boolean {
  // Vite / bundler environments
  if (import.meta?.env?.ENVIRONMENT !== undefined) {
    return import.meta.env.ENVIRONMENT !== 'production'
  }

  return process.env.ENVIRONMENT !== 'production'
}
