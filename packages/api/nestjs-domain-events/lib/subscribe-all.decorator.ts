export const SUBSCRIBE_ALL_KEY = 'wisemen.subscribe-all'
export type SubscribeAllMethodNames = Set<string>

/** Subscribe to all domain events */
export function SubscribeToAll (): MethodDecorator {
  return (target: object, methodName: string) => {
    const methodNames = Reflect.getMetadata(
      SUBSCRIBE_ALL_KEY,
      target
    ) as SubscribeAllMethodNames ?? new Set<string>()

    methodNames.add(methodName)
    Reflect.defineMetadata(SUBSCRIBE_ALL_KEY, methodNames, target)
  }
}
