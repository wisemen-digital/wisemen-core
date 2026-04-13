import { DateRangeDto } from './date-range.dto.js'

export class DateRangeDtoBuilder {
  private readonly dto: DateRangeDto

  constructor () {
    this.dto = new DateRangeDto()
    this.dto.startDate = '-infinity'
    this.dto.endDate = 'infinity'
  }

  withStartDate (date: string): this {
    this.dto.startDate = date

    return this
  }

  withEndDate (date: string): this {
    this.dto.endDate = date

    return this
  }

  build (): DateRangeDto {
    return this.dto
  }
}
