import type { Component } from 'vue'

import {
  DEFAULT_MAX_SUB_ACTIONS,
  DEFAULT_MIN_APPLICABILITY_SCORE,
  DEFAULT_MIN_SEARCH_INPUT_LENGTH,
  PARENT_ACTION_SCORE_PENALTY,
  SCORE_GROUP_PRIORITY_THRESHOLD,
  SECONDARY_SCORE_WEIGHT,
} from '#const/index.ts'
import { isAuthenticated } from '#createActions.ts'
import type {
  Action,
  ActionAvatar,
  SearchSubActionsConfig,
  SubActionsWithMeta,
} from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'

export type ActionFactory = (() => Action[]) | Action

const wordRegex = /[\s\-_./]+/

export async function applicableActions(
  actions: Action[],
  ctx: ActionContext,
  onUpdate?: (partial: Action[]) => void,
  parentAction?: Action,
): Promise<Action[]> {
  const searchInputLength = ctx.searchInput.length
  const isSearching = searchInputLength >= 0
  let candidates = resolveActionFactories(actions)

  if (isSearching) {
    const syncCandidates: Action[] = []
    const asyncTasks: Array<() => Promise<Action[]>> = []
    const queue = [
      ...candidates,
    ]

    while (queue.length > 0) {
      const action = queue.shift()!

      syncCandidates.push(action)

      if (!resolveApplicable(action, ctx)) {
        continue
      }

      const searchSubActionsConfig = resolveSearchSubActionsConfig(action, ctx)

      const searchInputMinLengthForSubActions = searchSubActionsConfig?.minLength
        ?? DEFAULT_MIN_SEARCH_INPUT_LENGTH
      const shouldSearchSubActions = searchInputLength >= searchInputMinLengthForSubActions

      if (action.subActions !== undefined && shouldSearchSubActions) {
        const maxResults = searchSubActionsConfig?.maxResults ?? DEFAULT_MAX_SUB_ACTIONS
        const result = action.subActions(ctx)

        // eslint-disable-next-line max-depth
        if (Array.isArray(result)) {
          // Sync: process immediately and enqueue children for further BFS
          const lifted = decorateLiftedChildren(result.slice(0, maxResults), action)

          queue.push(...lifted)
        }
        else if (isSubActionsWithMeta(result)) {
          // Sync SubActionsWithMeta: treat like a plain array (meta is for scroll pagination, ignored here)
          const lifted = decorateLiftedChildren(result.actions.slice(0, maxResults), action)

          queue.push(...lifted)
        }
        else {
          // Async (Promise or AsyncGenerator): schedule as background task
          const capturedAction = action

          asyncTasks.push(async () => {
            const children = await resolveAsyncSubActions(result, maxResults)

            return decorateLiftedChildren(children, capturedAction)
          })
        }
      }
    }

    if (asyncTasks.length > 0 && onUpdate !== undefined) {
      // Emit sync-only result immediately so the menu is not blank
      onUpdate(filterAndRank(syncCandidates, ctx, parentAction))

      // Fire all async tasks in parallel; each one updates the list when it settles
      const allCandidates = [
        ...syncCandidates,
      ]

      await Promise.all(asyncTasks.map(async (task) => {
        const lifted = await task()

        allCandidates.push(...lifted)
        onUpdate(filterAndRank(allCandidates, ctx, parentAction))
      }))

      return filterAndRank(allCandidates, ctx, parentAction)
    }

    // No onUpdate: await everything synchronously (backwards-compatible)
    const allLifted = (
      await Promise.all(asyncTasks.map((t) => t()))
    // eslint-disable-next-line unicorn/no-await-expression-member
    ).flat()

    candidates = [
      ...syncCandidates,
      ...allLifted,
    ]
  }

  return filterAndRank(candidates, ctx, parentAction)
}

function filterAndRank(candidates: Action[], ctx: ActionContext, parentAction?: Action): Action[] {
  const searchInputLength = ctx.searchInput.length
  const isSearching = searchInputLength >= 0

  const seenKeys = new Set<string>()
  const seenIds = new Set<string>()
  const visibleActions: Action[] = []

  for (const action of candidates) {
    if (!resolveApplicable(action, ctx)) {
      continue
    }

    if (action.id !== undefined) {
      if (seenIds.has(action.id)) {
        continue
      }

      seenIds.add(action.id)
    }

    if (action.key !== undefined) {
      if (seenKeys.has(action.key)) {
        continue
      }

      seenKeys.add(action.key)
    }

    visibleActions.push(action)
  }

  if (isSearching) {
    const scored: Array<{
      action: Action
      score: number
    }> = visibleActions.map((action) => ({
      action,
      score: scoreAction(action, ctx.searchInput, ctx),
    }))

    let passing = scored.filter(({
      score,
    }) => score >= DEFAULT_MIN_APPLICABILITY_SCORE)

    // Sort by descending score; when scores are within the threshold, group priority decides
    passing = passing.toSorted((a, b) => {
      // Top-level actions always sort above lifted sub-actions
      const aIsLifted = a.action.parentAction !== undefined ? 1 : 0
      const bIsLifted = b.action.parentAction !== undefined ? 1 : 0

      if (aIsLifted !== bIsLifted) {
        return aIsLifted - bIsLifted
      }

      const aParent = a.action.parentAction ?? parentAction
      const bParent = b.action.parentAction ?? parentAction
      const aSelected = (aParent?.showSelectedSubActionsFirst !== false && resolveActionSelected(a.action, ctx)) ? 0 : 1
      const bSelected = (bParent?.showSelectedSubActionsFirst !== false && resolveActionSelected(b.action, ctx)) ? 0 : 1

      if (aSelected !== bSelected) {
        return aSelected - bSelected
      }

      const scoreDiff = b.score - a.score

      if (Math.abs(scoreDiff) > SCORE_GROUP_PRIORITY_THRESHOLD) {
        return scoreDiff
      }

      const pa = resolveGroupPriority(a.action, ctx)
      const pb = resolveGroupPriority(b.action, ctx)

      if (pa !== pb) {
        return pa - pb
      }

      return scoreDiff
    })

    return passing.map((s) => s.action)
  }

  const showSelectedFirst = parentAction?.showSelectedSubActionsFirst !== false

  return visibleActions.sort((a, b) => {
    const aSelected = (showSelectedFirst && resolveActionSelected(a, ctx)) ? 0 : 1
    const bSelected = (showSelectedFirst && resolveActionSelected(b, ctx)) ? 0 : 1

    if (aSelected !== bSelected) {
      return aSelected - bSelected
    }

    return resolveGroupPriority(a, ctx) - resolveGroupPriority(b, ctx)
  })
}

function isSubActionsWithMeta(value: unknown): value is SubActionsWithMeta {
  return value !== null
    && typeof value === 'object'
    && 'actions' in value
    && 'pagination' in value
    && Array.isArray((value as SubActionsWithMeta).actions)
}

async function resolveAsyncSubActions(
  result: AsyncGenerator<Action> | Promise<Action[] | SubActionsWithMeta>,
  maxSubActions: number,
): Promise<Action[]> {
  if (result instanceof Promise) {
    const awaited = await result

    if (isSubActionsWithMeta(awaited)) {
      return awaited.actions.slice(0, maxSubActions)
    }

    return (awaited as Action[]).slice(0, maxSubActions)
  }

  // AsyncGenerator
  const children: Action[] = []

  for await (const item of result) {
    children.push(item)

    if (children.length >= maxSubActions) {
      break
    }
  }

  return children
}

function resolveActionFactories(sources: ActionFactory[]): Action[] {
  const result: Action[] = []

  for (const src of sources) {
    if (typeof src === 'function') {
      result.push(...src())
    }
    else {
      result.push(src)
    }
  }

  return result
}

function decorateLiftedChildren(children: Action[], parent: Action): Action[] {
  const rootAction = parent.rootAction ?? parent

  return children.map((child) => ({
    ...child,
    group:
      child.group === undefined && parent.group?.groupWhenLifted
        ? parent.group.groupWhenLifted
        : child.group,
    parentAction: parent,
    rootAction,
    onlyVisibleThroughSearch: true,
  }))
}

export function resolveApplicable(action: Action, ctx: ActionContext): boolean {
  if (!isAuthenticated.value && action.availableWhenUnauthenticated !== true) {
    return false
  }

  if (action.isApplicable !== undefined && !action.isApplicable(ctx)) {
    return false
  }

  if (ctx.menuType === 'commandMenu'
    && action.disabledReason !== undefined
    && typeof action.disabledReason(ctx) === 'string'
  ) {
    return false
  }

  // onlyVisibleThroughSearch — only hide in menus when user has not typed anything
  if (action.onlyVisibleThroughSearch && ctx.menuType !== undefined && ctx.searchInput.length === 0) {
    return false
  }

  return true
}

function resolveGroupPriority(action: Action, ctx: ActionContext): number {
  const p = action.group?.priority ?? null

  if (p === null) {
    return 9999
  }

  return typeof p === 'function' ? p(ctx) : p
}

function scoreAction(action: Action, query: string, ctx: ActionContext): number {
  if (query.trim().length === 0) {
    return 1
  }

  if (action.skipFilterScoring) {
    return 1
  }

  const mainStr = resolveActionName(action, ctx)
  const secondaryStr = buildSecondaryString(action, ctx)

  // keywordsExactMatch → instant 1.0 if exact substring hit
  if (action.keywordsExactMatch) {
    const kems = Array.isArray(action.keywordsExactMatch)
      ? action.keywordsExactMatch
      : [
          action.keywordsExactMatch,
        ]

    if (kems.some((k) => mainStr.toLowerCase().includes(k.toLowerCase()))) {
      return 1.0
    }
    if (kems.some((k) => secondaryStr.toLowerCase().includes(k.toLowerCase()))) {
      return 1.0
    }
  }

  const mainScore = fuzzyScoreSync(mainStr, query)
  const secondaryScore = fuzzyScoreSync(secondaryStr, query) * SECONDARY_SCORE_WEIGHT

  let score = Math.max(mainScore, secondaryScore)

  // Substring fallback: if fuzzy failed but substring exists, assign a floor
  if (score < DEFAULT_MIN_APPLICABILITY_SCORE) {
    if (mainStr.toLowerCase().includes(query.toLowerCase())) {
      score = 0.29
    }
    else if (secondaryStr.toLowerCase().includes(query.toLowerCase())) {
      score = 0.245
    }
  }

  // Parent-action penalty (lifted sub-actions are less prominent)
  if (action.parentAction) {
    score += PARENT_ACTION_SCORE_PENALTY
  }

  // scoreOverride replaces the computed score
  if (action.scoreOverride !== undefined) {
    score = action.scoreOverride
  }

  // sortPriority nudges the final value (positive = pushed down)
  if (action.sortPriority !== undefined) {
    score -= action.sortPriority * 0.0001
  }

  return score
}

function buildSecondaryString(action: Action, ctx: ActionContext): string {
  const parts: string[] = []

  const parentScoreInfluence = action.parentScoreInfluence ?? 'all'

  if (parentScoreInfluence !== 'none') {
    // Parent breadcrumb chain
    let parent = action.parentAction

    if (parentScoreInfluence === 'all') {
      while (parent) {
        const parentName
        // eslint-disable-next-line no-nested-ternary
          = parent.nameAsParent
            ? (typeof parent.nameAsParent === 'function'
                ? parent.nameAsParent(ctx)
                : parent.nameAsParent)
            : resolveActionName(parent, ctx)

        parts.push(parentName)
        parent = parent.parentAction
      }
    }

    if (parentScoreInfluence === 'direct' && action.parentAction !== undefined) {
      const parent = action.parentAction

      const parentName
        // eslint-disable-next-line no-nested-ternary
        = parent.nameAsParent
          ? (typeof parent.nameAsParent === 'function'
              ? parent.nameAsParent(ctx)
              : parent.nameAsParent)
          : resolveActionName(parent, ctx)

      parts.push(parentName)
    }
  }

  // Action name itself
  parts.push(resolveActionName(action, ctx))

  // Keywords
  if (action.keywords !== undefined) {
    const kw = Array.isArray(action.keywords)
      ? action.keywords
      : [
          action.keywords,
        ]

    parts.push(...kw)
  }

  return parts.join(' ')
}

function fuzzyScoreSync(str: string, query: string): number {
  if (!str || !query) {
    return 0
  }

  const s = str.toLowerCase().trim()
  const q = query.toLowerCase().trim()

  if (!q) {
    return 1.0
  }
  if (s === q) {
    return 1.0
  }
  if (s.startsWith(q)) {
    return 0.92 - Math.min(0.12, (s.length - q.length) * 0.002)
  }

  const idx = s.indexOf(q)

  if (idx !== -1) {
    return 0.82 - Math.min(0.12, idx * 0.004)
  }

  const words = s.split(wordRegex)

  if (words.some((w) => w.startsWith(q))) {
    return 0.68
  }

  const initials = words.map((w) => w[0] ?? '').join('')

  if (initials === q || initials.startsWith(q)) {
    return 0.60
  }

  // Subsequence
  const n = s.length
  const m = q.length

  if (m > n) {
    return 0
  }
  let qi = 0
  let firstAt = -1
  let lastAt = -1
  let prev = -1
  let consec = 0
  let bonus = 0

  for (let si = 0; si < n && qi < m; si++) {
    if (s[si] === q[qi]) {
      if (firstAt === -1) {
        firstAt = si
      }

      lastAt = si
      qi++

      if (prev === si - 1) {
        consec++
        bonus += consec * 0.08
      }
      else {
        consec = 0
      }

      prev = si
    }
  }
  if (qi < m) {
    return 0
  }
  const span = lastAt - firstAt + 1
  const raw
    = (1 - firstAt / n) * 0.30
      + (m / span) * 0.35
      + (m / n) * 0.20
      + Math.min(bonus, 0.15)

  return Math.min(0.55, Math.max(0, raw))
}

export function resolveActionValue<T>(value: ((ctx: ActionContext) => T) | T, ctx: ActionContext): T {
  return typeof value === 'function' ? (value as (ctx: ActionContext) => T)(ctx) : value
}

export function resolveActionName(action: Action, ctx: ActionContext): string {
  return typeof action.name === 'function' ? action.name(ctx) : action.name
}

export function resolveActionAvatar(action: Action, ctx: ActionContext): ActionAvatar | null {
  return typeof action.avatar === 'function' ? action.avatar(ctx) : action.avatar ?? null
}

export function resolveActionHint(action: Action, ctx: ActionContext): string | null {
  return typeof action.hint === 'function' ? action.hint(ctx) : action.hint ?? null
}

export function resolveActionSelected(action: Action, ctx: ActionContext): boolean | null {
  return typeof action.selected === 'function' ? action.selected(ctx) : action.selected ?? null
}

export function resolveSearchSubActionsConfig(action: Action, ctx: ActionContext): SearchSubActionsConfig | null {
  return typeof action.searchSubActionsConfig === 'function'
    ? action.searchSubActionsConfig(ctx)
    : action.searchSubActionsConfig ?? null
}

export function resolveActionPreview(action: Action, ctx: ActionContext): Component | null {
  return typeof action.preview === 'function' ? action.preview(ctx) : null
}
