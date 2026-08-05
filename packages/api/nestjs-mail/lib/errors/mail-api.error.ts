export class MailApiError extends Error {
  constructor (
    readonly provider: string,
    readonly status: number,
    readonly body: string
  ) {
    super(`${provider} responded with ${status}: ${body}`)
    this.name = 'MailApiError'
  }
}
