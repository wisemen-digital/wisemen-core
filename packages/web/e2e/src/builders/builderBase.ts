import { randomUUID } from 'node:crypto'

/**
 * Abstract fluent builder base for constructing test data objects.
 *
 * Subclasses seed the initial value in their constructor and expose
 * chainable `with*` methods that mutate `this.value` and return `this`.
 *
 * @example
 * ```ts
 * class UserDtoBuilder extends BuilderBase<UserDto> {
 *   constructor(initial?: Partial<UserDto>) {
 *     super({ uuid: BuilderBase.randomUuid(), name: 'John', ...initial })
 *   }
 *   withName(name: string): this { this.value.name = name; return this }
 * }
 * ```
 */
export abstract class BuilderBase<T> {
  protected value: T

  constructor(initial: T) {
    this.value = initial
  }

  /**
   * Generate a random UUID, typically used to seed identifier fields.
   */
  static randomUuid(): string {
    return randomUUID()
  }

  /**
   * Return a deep clone of the current value so callers cannot mutate
   * the builder's internal state after building.
   */
  build(): T {
    return structuredClone(this.value)
  }
}
