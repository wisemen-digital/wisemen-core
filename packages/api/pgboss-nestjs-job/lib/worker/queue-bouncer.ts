export declare type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

export abstract class QueueBouncer {
  abstract canProceed (): boolean | Promise<boolean>
}

export class AllowBouncer extends QueueBouncer {
  canProceed (): boolean {
    return true
  }
}
