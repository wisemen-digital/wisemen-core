export class ViesUnavailableError extends Error {
  constructor () {
    super('Vies temporarily unavailable')
  }
}
