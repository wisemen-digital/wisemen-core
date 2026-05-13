import type { Router } from 'vue-router'

import type { ActionModel } from '#types/actionModel.type.ts'

/**
 * Contextual information available to actions during execution or evaluation.
 * Provides access to models, routing state, user input, and UI context.
 *
 * @template TModelMap - A map of model names to their corresponding types.
 * @template TRouter - A tuple of route definition objects, each having at least a `name` property.
 */
export interface ActionContext<
  TModelMap = Record<string, ActionModel>,
  TRoutes extends any[] = any[],
  TMetadata = any,
> {
  /**
   * Returns the stored pagination offset for a given action id, or `null` if no
   * offset is stored (initial call) or all pages are exhausted.
   */
  getPaginationOffsetForSubActionId: (id: string) => number | null

  /**
   * Returns whether any dialog is currently open and active in the UI.
   *
   * @returns `true` if at least one dialog is currently active.
   */
  hasActiveDialogs: () => boolean

  /**
   * Returns whether any targeted models of the given type are currently selected.
   *
   * @template TModelName - A key of `TModelMap`.
   * @param modelName - The model type to check for.
   * @returns `true` if at least one targeted model of the given type exists.
   */
  hasTargetedModelsOfType: <TModelName extends keyof TModelMap>(modelName: TModelName) => boolean

  /**
   * Returns whether the specified route is currently active.
   *
   * @param routeName - The name of the route to check, constrained to known route names in `TRouter`.
   * @param exact - When `true`, requires an exact route match rather than a prefix match. Defaults to `false`.
   * @returns `true` if the route is active.
   */
  isRouteActive: (routeName: TRoutes[number]['name'], exact?: boolean) => boolean

  /**
   * All models currently available in the application, regardless of selection or focus state.
   */
  allModels: TModelMap[keyof TModelMap][]

  /**
   * Models that currently have keyboard or UI focus.
   * A subset of {@link allModels}.
   */
  focusedModels: TModelMap[keyof TModelMap][]

  /**
   * The keyboard event that triggered the current action, if any.
   * Absent when the action was triggered through a non-keyboard interaction.
   */
  keyboardEvent?: KeyboardEvent

  /**
   * The type of menu from which the action was invoked, if applicable.
   *
   * - `'commandMenu'` — triggered from a command palette or global search menu.
   * - `'contextualMenu'` — triggered from a right-click or context-sensitive menu.
   *
   * Absent when the action was not invoked from a menu.
   */
  menuType?: 'commandMenu' | 'contextualMenu'

  /**
   * Arbitrary key/value data registered by components via `registerMetadata`.
   * Typed at the application level by augmenting `TMetadata`.
   */
  metadata: TMetadata

  /**
   * The currently targeted (selected) models.
   * This is the primary set of models the action should operate on.
   */
  models: TModelMap[keyof TModelMap][]

  /**
   * The application's router state, represented as a tuple of route objects.
   * Each entry corresponds to a route definition with at least a `name` field.
   */
  router: Router

  /**
   * The current search or filter string entered by the user in the active menu.
   * Empty string when no input has been provided.
   */
  searchInput: string

  /**
   * Pagination offsets from previous `subActions` calls, keyed by action id.
   * Set by the host menu when triggering a "load more" scroll event.
   * Prefer `getPaginationOffsetForSubActionId` over reading this directly.
   */
  subActionsMeta?: Record<string, number | null>

  /**
   * Returns the targeted model filtered to only those matching the given model type.
   *
   * @template TModelName - A key of `TModelMap`.
   * @param modelName - The model type to filter by.
   * @returns An first targeted model of the specified type, or null
   */
  targetedModelOfType: <TModelName extends keyof TModelMap>(modelName: TModelName) => TModelMap[TModelName] | null
  /**
   * Returns the targeted model filtered to only those matching the given model type.
   *
   * @template TModelName - A key of `TModelMap`.
   * @param modelName - The model type to filter by.
   * @returns An first targeted model of the specified type.
   */
  targetedModelOfTypeOrThrow: <TModelName extends keyof TModelMap>(modelName: TModelName) => TModelMap[TModelName]
  /**
   * Returns the targeted models filtered to only those matching the given model type.
   *
   * @template TModelName - A key of `TModelMap`.
   * @param modelName - The model type to filter by.
   * @returns An array of targeted models of the specified type.
   */
  targetedModelsOfType: <TModelName extends keyof TModelMap>(modelName: TModelName) => TModelMap[TModelName][]
}

export type Resolvable<T, TContext> = ((ctx: TContext) => T) | T
