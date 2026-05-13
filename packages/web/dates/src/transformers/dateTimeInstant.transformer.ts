import type { DateTimeInstant } from '#models/dateTimeInstant.model.ts'
import { DateUtil } from '#utils/date.util.ts'

export class DateTimeInstantTransformer {
  static fromDto(dto: string): DateTimeInstant
  static fromDto(dto: null): null
  static fromDto(dto: string | null): DateTimeInstant | null
  static fromDto(dto: string | null): DateTimeInstant | null {
    if (dto === null) {
      return null
    }

    return DateUtil.instantFrom(dto)
  }

  static toDto(date: DateTimeInstant): string
  static toDto(date: null): null
  static toDto(date: DateTimeInstant | null): string | null {
    if (date === null) {
      return null
    }

    return date.toString()
  }
}
