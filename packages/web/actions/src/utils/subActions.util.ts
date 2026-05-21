import { DEFAULT_MAX_SUB_ACTIONS } from '#const/index.ts'
import type {
  Action,
  SubActionsWithMeta,
} from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import { isPromise } from '#utils/isPromise.util.ts'

export function isSubActionsWithMeta(v: unknown): v is SubActionsWithMeta {
  return v !== null
    && typeof v === 'object'
    && 'actions' in v
    && 'pagination' in v
    && Array.isArray((v as SubActionsWithMeta).actions)
}

export function storeSubActionsPagination(
  action: Action,
  result: Action[] | SubActionsWithMeta,
  subActionsMetaMap: Record<string, number | null>,
): Action[] {
  if (isSubActionsWithMeta(result)) {
    if (action.id) {
      subActionsMetaMap[action.id] = result.pagination.nextOffset
    }

    return result.actions
  }

  if (action.id) {
    delete subActionsMetaMap[action.id]
  }

  return result
}

export async function resolveSubActions(
  action: Action,
  ctx: ActionContext,
  subActionsMetaMap: Record<string, number | null>,
  limit = DEFAULT_MAX_SUB_ACTIONS * 3,
): Promise<Action[]> {
  if (action.subActions === undefined) {
    return []
  }

  const result = action.subActions(ctx)

  if (Array.isArray(result) || isSubActionsWithMeta(result)) {
    return storeSubActionsPagination(action, result, subActionsMetaMap)
  }

  if (isPromise(result)) {
    return storeSubActionsPagination(action, await result, subActionsMetaMap)
  }

  // AsyncGenerator
  const items: Action[] = []

  for await (const item of result) {
    items.push(item)

    if (items.length >= limit) {
      break
    }
  }

  return items
}
