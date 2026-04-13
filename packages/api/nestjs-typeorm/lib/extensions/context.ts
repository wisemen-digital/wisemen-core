import { AsyncLocalStorage } from 'async_hooks'
import type { EntityManager } from 'typeorm'

export const transactionStorage = new AsyncLocalStorage<EntityManager | null>()
export const readonlyStorage = new AsyncLocalStorage<EntityManager | null>()

export function isInTransaction (): boolean {
  return transactionStorage.getStore() != null
}

export function isInReadonly (): boolean {
  return readonlyStorage.getStore() != null
}
