import { DateTimeRangeDto } from './date-time-range.command.js'

export class DateTimeRangeCommandBuilder {
  private readonly command: DateTimeRangeDto

  constructor () {
    this.command = new DateTimeRangeDto()
    this.command.startDate = '-infinity'
    this.command.endDate = 'infinity'
  }

  withStartDate (date: string): this {
    this.command.startDate = date

    return this
  }

  withEndDate (date: string): this {
    this.command.endDate = date

    return this
  }

  build (): DateTimeRangeDto {
    return this.command
  }
}
