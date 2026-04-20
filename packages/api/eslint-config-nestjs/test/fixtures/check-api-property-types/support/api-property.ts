export function ApiProperty (_options: Record<string, unknown> = {}): PropertyDecorator {
  return function (_target: object, _propertyKey: string | symbol): void {}
}
