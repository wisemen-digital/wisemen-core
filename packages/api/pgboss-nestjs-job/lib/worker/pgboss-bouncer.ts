export declare type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

export abstract class PgbossBouncer {
  abstract canProceed (): boolean | Promise<boolean>
}

export class AllowBouncer extends PgbossBouncer {
  canProceed (): boolean {
    return true
  }
}
