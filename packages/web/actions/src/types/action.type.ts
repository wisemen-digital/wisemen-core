import type { Component } from 'vue'

import type { Resolvable } from '#types/actionContext.type.ts'
import type { ActionGroup } from '#types/actionGroup.type.ts'
import type { KeyboardShortcut } from '#types/keyboardShortcut.type.ts'

export interface ActionAvatar {
  /**
   * By default, the avatar's background color is generated based on
   * the provided name to ensure consistency across renders.
   * Setting this prop to `true` will disable this behavior and
   * use a static background color instead.
   */
  isStaticColor?: boolean
  /**
   * The name used to generate fallback initials.
   */
  name: string
  /**
   * The image source URL for the avatar's logo.
   * Falls back to initials when not provided.
   * @default null
   */
  logo?: string | null
  /**
   * The image source URL for the avatar.
   * Falls back to initials when not provided.
   * @default null
   */
  src?: string | null
}

export interface SearchSubActionsConfig {
  /*
   * Maximum sub-action results returned during search lifting. Default: 10.
  */
  maxResults?: number
  /*
   * Minimum characters required before sub-actions are searched. Default: 0.
   */
  minLength?: number
  /*
   * Placeholder text for the sub-action search input.
   */
  placeholder?: (() => string) | string
}

export interface SubActionsWithMeta<TContext = any> {
  actions: Action<TContext>[]
  /** Next-page cursor offset. Pass back via `ctx.subActionsMeta` to fetch the next page. `null` = no more pages. */
  pagination: { nextOffset: number | null }
}

export interface Action<TContext = any> {
  /**
   * Stable UUID used for deduplication and keyboard-shortcut registration.
   * Generated once at definition time (e.g. via crypto.randomUUID()).
   */
  id: string
  /**
   * Returns false to hide the action entirely from the menu.
   * Evaluated once per render cycle.
   */
  isApplicable?: (ctx: TContext) => boolean
  /**
   * Primary display name.  May be a static string or a function that reads the
   * context (e.g. to return "Add" vs "Remove" based on current selection).
   */
  name: Resolvable<string, TContext>
  /**
   * When false (default), the action is hidden when the user is not authenticated.
   * Set to true to keep the action visible on unauthenticated views (e.g. login page).
   */
  availableWhenUnauthenticated?: boolean
  /**
   *
   */
  avatar?: Resolvable<ActionAvatar, TContext>
  /**
   * Returns a human-readable string explaining why the action is disabled, or
   * undefined / null if it is enabled.
   * A disabled action is still visible (greyed out) with the reason as a tooltip.
   */
  disabledReason?: (ctx: TContext) => string | null | undefined
  /**
   * Called when the user activates the action.
   * May return a Promise for async operations.
   */
  execute?: (ctx: TContext) => Promise<void> | void
  /**
   * When true is set on an action, it prevents the action from being set
   * as the parent action when opening its sub-menu
   */
  forceAsRootMenu?: boolean
  /**
   * The group this action belongs to.
   */
  group?: ActionGroup<TContext>
  /**
   * Short secondary label shown next to the action name (e.g. in the command
   * menu).  Use this to provide extra context that does not fit in the name —
   * for example a file path, a record ID, or a status badge.
   *
   * May be a static string, `null`, or a function that reads the context.
   */
  hint?: Resolvable<string | null, TContext>
  /**
   * Optionally show an icon for the action
   */
  icon?: (ctx: TContext) => Component | null
  /**
   * Optional string key used for deduplication when the same logical action is
   * registered from multiple places.  Only the first registration wins.
   */
  key?: string
  /**
   * Keyboard shortcut
   */
  keyboardShortcut?: KeyboardShortcut
  /**
   * Extra search terms (not displayed) that boost discoverability.
   * Matched against the fuzzy query in addition to name.
   */
  keywords?: string | string[]
  /**
   * Keywords that must be an exact substring match (case-insensitive) to boost
   * the action score to 1.0.
   */
  keywordsExactMatch?: string[]
  /**
   * When set to true, the command menu will not close when toggling its sub actions
   */
  multiSelectSubActions?: boolean
  /**
   * The name to show in breadcrumbs / parent references when this action is a
   * parent of a sub-action drill-down.  Falls back to `name` when absent.
   */
  nameAsParent?: Resolvable<string, TContext>
  /**
   * The parent action of this action, if it is a sub-action.  Injected automatically when drilling down or lifting.
   */
  parentAction?: Action<TContext>
  /**
   * Controls how parent actions influence this action’s fuzzy search score.
   *
   * By default, parent metadata (e.g. parent label / context) is included in the
   * scoring input to improve discoverability of nested actions.
   *
   * This option allows you to reduce or fully remove that influence.
   *
   * Values:
   * - 'none' → Parents actions are fully excluded in scoring
   * - 'direct' → Only the direct parent is included in the scoring
   * - 'all' → All parent context is excluded; scoring is based only on this action
   *
   * @default 'all'
   */
  parentScoreInfluence?: 'all' | 'direct' | 'none'
  /**
   * Returns a Vue component displayed in a side panel when the user presses
   * the right arrow key while this action is focused. Useful for showing a
   * richer preview (e.g. details, metadata, a summary) without leaving the
   * current menu context.
   */
  preview?: (ctx: TContext) => Component | null
  /**
   * The root action of this action, if it is a sub-action.  Injected automatically when drilling down or lifting.
   */
  rootAction?: Action<TContext>
  /**
   * Override the computed fuzzy score with a fixed value.
   * Applied after parent-action penalty and before sortPriority.
   */
  scoreOverride?: number
  /**
   * Fine-grained control over how sub-actions are searched and displayed.
   */
  searchSubActionsConfig?: Resolvable<SearchSubActionsConfig, TContext>
  /**
   * When resolved to true, a checkmark / selected indicator is shown.
   * Used for toggle actions.
   */
  selected?: Resolvable<boolean, TContext>
  /**
   * Groups this action into a named visual section for context menus and dropdown
   * menus. A separator is rendered whenever the section key changes between two
   * adjacent visible actions. Actions without a separatorGroup (or sharing the
   * same key) are rendered without a separator between them.
   *
   * Has no effect when a search query is active.
   *
   * @example
   * // Edit action — no separatorGroup (default section)
   * // Availability actions — separatorGroup: 'availability'
   * // Delete action — separatorGroup: 'delete'
   * // → separator before first availability action and before delete
   */
  separatorGroup?: string
  /**
   * Controls whether selected sub-actions are sorted to the top of the list.
   *
   * @default true
   */
  showSelectedSubActionsFirst?: boolean
  /**
   * When true, this action is always included in results regardless of its fuzzy
   * score (score is overridden to 1.0 when filtering is skipped).
   */
  skipFilterScoring?: boolean
  /**
   * Manual sort offset applied after score-based sorting.
   * Positive values push the action down; negative values pull it up.
   */
  sortPriority?: number
  /**
   * Factory that returns child actions.  When the user selects this action the
   * menu drills down into the child list.
   * During a search query, child actions are "lifted" to the top level with
   * parentAction / rootAction injected.
   *
   * May return a `SubActionsWithMeta` wrapper to carry pagination state. The
   * meta is stored by the host menu and passed back via `ctx.subActionsMeta`
   * (keyed by this action's id) on subsequent "load more" calls.
   */
  subActions?: (ctx: TContext) =>
    | Action<TContext>[]
    | AsyncGenerator<Action<TContext>>
    | Promise<Action<TContext>[] | SubActionsWithMeta<TContext>>
    | SubActionsWithMeta<TContext>
  /**
   * When true, keyboard shortcuts defined on sub-actions are registered globally.
   * The actionShortcuts composable will recursively resolve sub-actions (synchronous
   * results only) and include their shortcuts in the global hotkey map.
   */
  subActionsHaveKeyboardShortcuts?: boolean
  /**
   * When true the action is hidden in the root menu (no search query).
   * It only appears in search results.
   */
  onlyVisibleThroughSearch?: boolean
}
