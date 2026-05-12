import type {
  HotkeySequence,
  UseHotkeyDefinition,
  UseHotkeySequenceDefinition,
} from '@tanstack/vue-hotkeys'
import {
  useHotkeys,
  useHotkeySequences,
} from '@tanstack/vue-hotkeys'

import { useActionManagerStore } from '#stores/actionManager.store.ts'
import { useActionRegistryStore } from '#stores/actionRegistry.store.ts'
import type {
  Action,
  SubActionsWithMeta,
} from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import type {
  SequenceShortcut,
  SingleKeyShortcut,
} from '#types/keyboardShortcut.type.ts'
import { resolveApplicable } from '#utils/resolveActions.util.ts'

function* collectActionsForShortcuts(actions: Action[], ctx: ActionContext): Generator<Action> {
  for (const action of actions) {
    yield action

    if (action.subActionsHaveKeyboardShortcuts !== true || action.subActions === undefined) {
      continue
    }

    const result = action.subActions(ctx)

    if (Array.isArray(result)) {
      yield* collectActionsForShortcuts(result, ctx)
    }
    else if (
      result !== null
      && typeof result === 'object'
      && 'actions' in result
      && Array.isArray((result as SubActionsWithMeta).actions)
    ) {
      yield* collectActionsForShortcuts((result as SubActionsWithMeta).actions, ctx)
    }
  }
}

function simpleShortcutKey(sc: SingleKeyShortcut): string {
  return [
    sc.key,
    sc.alt === true ? 'alt' : '',
    sc.ctrl === true ? 'ctrl' : '',
    sc.meta === true ? 'meta' : '',
    sc.mod === true ? 'mod' : '',
    sc.shift === true ? 'shift' : '',
  ].filter(Boolean).join('+')
}

/**
 * Installs global keyboard shortcut listeners for all registered actions using
 * TanStack Hotkeys.
 *
 * Actions with a `{ sequence }` shortcut are registered as multi-step sequences
 * (e.g. ['g', 's']). All other actions with a `keyboardShortcut` are registered
 * as single-key hotkeys (e.g. Mod+S).
 *
 * When a shortcut fires:
 *   - `action.isApplicable(ctx)` is checked; if false the callback is a no-op.
 *   - `action.execute(ctx)` is called.
 *
 * `ignoreInputs` is derived from `runWithInputFocus` on each shortcut:
 * shortcuts with `runWithInputFocus: true` also fire while a text field is
 * focused; all others are suppressed.
 *
 * Both registration lists are reactive — temporary actions registered at
 * runtime are picked up automatically.
 *
 * Call this composable once, at the app root level (e.g. App.vue).
 *
 * @param buildCtx  Optional factory to supply a custom ActionContext for
 *                  shortcut-triggered actions.  Defaults to the action manager's
 *                  default context.
 */
export function useActionShortcuts(
  buildCtx?: () => ActionContext,
): void {
  const registry = useActionRegistryStore()
  const manager = useActionManagerStore()

  function makeFirstApplicableCallback(actions: Action[]) {
    return (): void => {
      const ctx: ActionContext = buildCtx
        ? buildCtx()
        : manager.actionContext({})

      // Iterate in reverse so that actions registered last (e.g. on row hover/focus)
      // take priority over earlier-registered page-level actions with the same shortcut.
      for (let i = actions.length - 1; i >= 0; i--) {
        const action = actions[i]!

        if (!resolveApplicable(action, ctx)) {
          continue
        }

        const result = action.execute?.(ctx)

        if (result instanceof Promise) {
          result.catch((error: unknown) => {
            console.error('[useActionShortcuts] action.execute threw:', error)
          })
        }

        return
      }
    }
  }

  useHotkeys(
    (): UseHotkeyDefinition[] => {
      const groups = new Map<string, Action[]>()
      const ctx = buildCtx ? buildCtx() : manager.actionContext({})

      for (const action of collectActionsForShortcuts(registry.allActions(), ctx)) {
        if (action.keyboardShortcut === undefined || 'sequence' in action.keyboardShortcut) {
          continue
        }

        const sc = action.keyboardShortcut as Exclude<typeof action.keyboardShortcut, SequenceShortcut>
        const key = simpleShortcutKey(sc!)

        if (!groups.has(key)) {
          groups.set(key, [])
        }

        groups.get(key)!.push(action)
      }

      return Array.from(groups.values()).map((actions) => {
        const sc = actions[0]!.keyboardShortcut as SingleKeyShortcut

        return {
          callback: makeFirstApplicableCallback(actions),
          hotkey: {
            key: sc!.key,
            ...(sc!.alt !== undefined && {
              alt: sc!.alt,
            }),
            ...(sc!.ctrl !== undefined && {
              ctrl: sc!.ctrl,
            }),
            ...(sc!.meta !== undefined && {
              meta: sc!.meta,
            }),
            ...(sc!.mod !== undefined && {
              mod: sc!.mod,
            }),
            ...(sc!.shift !== undefined && {
              shift: sc!.shift,
            }),
          },
          options: {
            ignoreInputs: !sc!.runWithInputFocus,
            preventDefault: true,
            stopPropagation: true,
          },
        }
      })
    },
    {
      conflictBehavior: 'allow',
    },
  )

  useHotkeySequences(
    (): UseHotkeySequenceDefinition[] => {
      const groups = new Map<string, Action[]>()
      const ctx = buildCtx ? buildCtx() : manager.actionContext({})

      for (const action of collectActionsForShortcuts(registry.allActions(), ctx)) {
        if (action.keyboardShortcut === undefined || !('sequence' in action.keyboardShortcut)) {
          continue
        }

        const sc = action.keyboardShortcut as SequenceShortcut
        const key = sc.sequence.join(',')

        if (!groups.has(key)) {
          groups.set(key, [])
        }

        groups.get(key)!.push(action)
      }

      return Array.from(groups.values()).map((actions) => {
        const sc = actions[0]!.keyboardShortcut as SequenceShortcut

        return {
          callback: makeFirstApplicableCallback(actions),
          options: {
            ignoreInputs: !sc.runWithInputFocus,
            preventDefault: true,
            stopPropagation: true,
          },
          sequence: sc.sequence as HotkeySequence,
        }
      })
    },
    {
      conflictBehavior: 'allow',
    },
  )
}
