import { DateTimeRangeDto } from './date-time-range.dto.js'

export class DateTimeRangeDtoBuilder {
  private readonly command: DateTimeRangeDto

  constructor () {
    this.command = new DateTimeRangeDto()
    this.command.from = '-infinity'
    this.command.until = 'infinity'
  }

  withFrom (date: string): this {
    this.command.from = date

    return this
  }

  withUntil (date: string): this {
    this.command.until = date

    return this
  }

  build (): DateTimeRangeDto {
    return this.command
  }
}
