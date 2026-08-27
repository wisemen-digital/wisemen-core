/**
 * Scoping helpers
 *
 * A "scope" is a base path (e.g. `apps/api`) that a Dangerfile's rules should be
 * restricted to. An empty/undefined scope means "whole repo" (root scope).
 *
 * These helpers let the rule runner pre-filter Danger's git file lists to the
 * active scope, so individual rules can stay scope-agnostic - they just read
 * `context.scopedFiles` instead of `danger.git.modified_files` etc.
 */

import type { DangerDSLType } from 'danger'

export interface ScopedFiles {
  modified: string[]
  created: string[]
  deleted: string[]
  /** Union of modified + created - the common case of "files touched by this PR". */
  edited: string[]
  /** Union of modified + created + deleted. */
  all: string[]
}

/**
 * Normalize a scope so prefix-matching doesn't false-positive on sibling
 * folders that share a prefix (e.g. `apps/api` must not match `apps/api-2`).
 * @param scope - Raw scope, e.g. `apps/api`, `apps/api/`, or `''`/undefined for root
 * @returns Normalized scope with no leading/trailing slashes, or `''` for root
 */
function normalizeScope (scope: string | undefined): string {
  if (scope == null || scope.trim() === '') {
    return ''
  }

  return scope.replace(/^\/+/, '').replace(/\/+$/, '')
}

/**
 * Check whether a repo-relative file path falls under the given scope.
 * @param filePath - Repo-relative file path, e.g. `apps/api/src/main.ts`
 * @param scope - Base path to check against; root scope (`''`) matches everything
 * @returns true if the file is within scope
 */
export function isInScope (filePath: string, scope: string | undefined): boolean {
  const normalizedScope = normalizeScope(scope)

  if (normalizedScope === '') {
    return true
  }

  return filePath === normalizedScope || filePath.startsWith(`${normalizedScope}/`)
}

/**
 * Compute the git file lists relevant to a scope, filtering Danger's
 * modified/created/deleted lists down to files under that scope.
 * @param danger - Danger DSL object
 * @param scope - Base path to scope to; root scope (`''`) returns everything
 * @returns Scoped file lists
 */
export function getScopedFiles (danger: DangerDSLType, scope: string | undefined): ScopedFiles {
  const { git } = danger

  const modified = git.modified_files.filter(file => isInScope(file, scope))
  const created = git.created_files.filter(file => isInScope(file, scope))
  const deleted = git.deleted_files.filter(file => isInScope(file, scope))

  const edited = [...new Set([...modified, ...created])]
  const all = [...new Set([...edited, ...deleted])]

  return { modified, created, deleted, edited, all }
}
