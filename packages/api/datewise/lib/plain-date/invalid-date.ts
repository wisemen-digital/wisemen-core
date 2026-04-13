import { DayjsPlainDate } from './dayjs-plain-date.js'

export class InvalidPlainDate extends Error {
  public constructor (
    public readonly date: DayjsPlainDate
  ) {
    super(`Invalid date: ${date.format('YYYY-MM-DD')}`)
  }
}
