export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return typeof (value as any)?.then === 'function'
}
