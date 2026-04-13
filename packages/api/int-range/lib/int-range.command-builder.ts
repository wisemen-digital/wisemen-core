import { IntRangeDto } from './int-range.command.js'

export class IntRangeCommandBuilder {
  private readonly command: IntRangeDto

  constructor () {
    this.command = new IntRangeDto()
    this.command.start = Number.MIN_SAFE_INTEGER.toString()
    this.command.end = Number.MAX_SAFE_INTEGER.toString()
  }

  withStart (value: number): this {
    this.command.start = value.toString()

    return this
  }

  withEnd (value: number): this {
    this.command.end = value.toString()

    return this
  }

  build (): IntRangeDto {
    return this.command
  }
}
