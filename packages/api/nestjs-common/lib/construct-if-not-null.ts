/**
 * Constructs a value when the constructor argument is not nullish.
 * Null and undefined inputs are normalized to null.
 */
export function constructIfNotNull<Input, Output> (
  ctor: new (input: Input) => Output,
  input: Input | null | undefined
): Output | null {
  if (input == null) {
    return null
  }

  return new ctor(input)
}
