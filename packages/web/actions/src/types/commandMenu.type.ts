import type { Action } from '#types/action.type.ts'

export interface NavFrame {
  actions: Action[]
  parentAction: Action
  /** The action that was highlighted when we drilled in (so we can re-focus it on back). */
  savedActiveAction: Action | null
  /** Resolved (filtered) actions at the time we drilled in, so we can restore them instantly on back. */
  savedResolvedActions: Action[]
  /** Search query active at the moment we drilled into this frame. */
  savedSearchInput: string
}
