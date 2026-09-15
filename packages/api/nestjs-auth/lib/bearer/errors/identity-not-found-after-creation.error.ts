export class IdentityNotFoundAfterCreationError extends Error {
  constructor () {
    super('Identity was not found after it was created simultaneously')
  }
}
