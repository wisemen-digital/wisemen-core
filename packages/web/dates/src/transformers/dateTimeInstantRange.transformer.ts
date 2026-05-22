/* eslint-disable vue/max-len */
import type {
  DateTimeRangeInstant,
  DateTimeRangeInstantWithEndInfinity,
  DateTimeRangeInstantWithInfinity,
  DateTimeRangeInstantWithStartInfinity,
} from '#models/dateTimeRange.model.ts'
import type {
  DateTimeInstantRangeField,
  DateTimeInstantRangeWithNullableEndField,
  DateTimeInstantRangeWithNullableStartField,
  NullableDateTimeInstantRangeField,
} from '#models/form/dateTimeInstantRangeField.model.ts'
import type { TimeZone } from '#models/timeZone.model.ts'
import { DateTimeInstantTransformer } from '#transformers/dateTimeInstant.transformer.ts'
import { DateUtil } from '#utils/date.util.ts'

interface DateTimeRangeDto {
  startDate: string
  endDate: string
}

interface DateTimeRangeWithInfinityDto {
  startDate: string | '-infinity' | 'infinity'
  endDate: string | '-infinity' | 'infinity'
}

export class DateTimeInstantRangeTransformer {
  static fieldToDto(field: DateTimeInstantRangeField, timeZone: TimeZone): DateTimeRangeDto
  static fieldToDto(field: NullableDateTimeInstantRangeField, timeZone: TimeZone): DateTimeRangeDto | null
  static fieldToDto(field: DateTimeInstantRangeField | NullableDateTimeInstantRangeField, timeZone: TimeZone): DateTimeRangeDto | null {
    if (field.from.date === null || field.from.time === null || field.until.date === null || field.until.time === null) {
      return null
    }

    return {
      startDate: DateTimeInstantTransformer.toDto(
        DateUtil.instantFromDateAndTime(field.from.date, field.from.time, timeZone),
      ),
      endDate: DateTimeInstantTransformer.toDto(
        DateUtil.instantFromDateAndTime(field.until.date, field.until.time, timeZone),
      ),
    }
  }

  static fieldWithNullableEndToDto(field: DateTimeInstantRangeWithNullableEndField, timeZone: TimeZone): DateTimeRangeWithInfinityDto {
    return {
      startDate: DateTimeInstantTransformer.toDto(DateUtil.instantFromDateAndTime(field.from.date, field.from.time, timeZone)),
      endDate: field.until.date === null || field.until.time === null
        ? 'infinity'
        : DateTimeInstantTransformer.toDto(DateUtil.instantFromDateAndTime(field.until.date, field.until.time, timeZone)),
    }
  }

  static fieldWithNullableStartToDto(field: DateTimeInstantRangeWithNullableStartField, timeZone: TimeZone): DateTimeRangeWithInfinityDto {
    return {
      startDate: field.from.date === null || field.from.time === null
        ? '-infinity'
        : DateTimeInstantTransformer.toDto(DateUtil.instantFromDateAndTime(field.from.date, field.from.time, timeZone)),
      endDate: DateTimeInstantTransformer.toDto(DateUtil.instantFromDateAndTime(field.until.date, field.until.time, timeZone)),
    }
  }

  static fromDto(dto: DateTimeRangeDto): DateTimeRangeInstant
  static fromDto(dto: null): null
  static fromDto(dto: DateTimeRangeDto | null): DateTimeRangeInstant | null
  static fromDto(dto: DateTimeRangeDto | null): DateTimeRangeInstant | null {
    if (dto === null) {
      return null
    }

    return {
      from: DateUtil.instantFrom(dto.startDate),
      until: DateUtil.instantFrom(dto.endDate),
    }
  }

  static fromDtoWithEndInfinity(dto: DateTimeRangeWithInfinityDto): DateTimeRangeInstantWithEndInfinity
  static fromDtoWithEndInfinity(dto: null): null
  static fromDtoWithEndInfinity(dto: DateTimeRangeWithInfinityDto | null): DateTimeRangeInstantWithEndInfinity | null
  static fromDtoWithEndInfinity(
    dto: DateTimeRangeWithInfinityDto | null,
  ): DateTimeRangeInstantWithEndInfinity | null {
    if (dto === null) {
      return null
    }

    if (DateTimeInstantRangeTransformer.isInfinity(dto.startDate)) {
      throw new Error(`fromDtoWithEndInfinity: startDate cannot be infinity, got "${dto.startDate}"`)
    }

    return {
      from: DateUtil.instantFrom(dto.startDate),
      until: DateTimeInstantRangeTransformer.isInfinity(dto.endDate)
        ? 'infinity'
        : DateUtil.instantFrom(dto.endDate),
    }
  }

  static fromDtoWithInfinity(dto: DateTimeRangeWithInfinityDto): DateTimeRangeInstantWithInfinity
  static fromDtoWithInfinity(dto: null): null
  static fromDtoWithInfinity(dto: DateTimeRangeWithInfinityDto | null): DateTimeRangeInstantWithInfinity | null
  static fromDtoWithInfinity(dto: DateTimeRangeWithInfinityDto | null): DateTimeRangeInstantWithInfinity | null {
    if (dto === null) {
      return null
    }

    return {
      from: DateTimeInstantRangeTransformer.isInfinity(dto.startDate)
        ? 'infinity'
        : DateUtil.instantFrom(dto.startDate),
      until: DateTimeInstantRangeTransformer.isInfinity(dto.endDate)
        ? 'infinity'
        : DateUtil.instantFrom(dto.endDate),
    }
  }

  static fromDtoWithStartInfinity(dto: DateTimeRangeWithInfinityDto | null): DateTimeRangeInstantWithStartInfinity | null
  static fromDtoWithStartInfinity(dto: DateTimeRangeWithInfinityDto): DateTimeRangeInstantWithStartInfinity
  static fromDtoWithStartInfinity(dto: null): null
  static fromDtoWithStartInfinity(
    dto: DateTimeRangeWithInfinityDto | null,
  ): DateTimeRangeInstantWithStartInfinity | null {
    if (dto === null) {
      return null
    }

    if (DateTimeInstantRangeTransformer.isInfinity(dto.endDate)) {
      throw new Error(`fromDtoWithStartInfinity: endDate cannot be infinity, got "${dto.endDate}"`)
    }

    return {
      from: DateTimeInstantRangeTransformer.isInfinity(dto.startDate)
        ? 'infinity'
        : DateUtil.instantFrom(dto.startDate),
      until: DateUtil.instantFrom(dto.endDate),
    }
  }

  static isInfinity(value: any): value is '-infinity' | 'infinity' {
    return value === 'infinity' || value === '-infinity'
  }

  static toDto(dateTimeRange: DateTimeRangeInstant): DateTimeRangeDto
  static toDto(dateTimeRange: null): null
  static toDto(dateTimeRange: DateTimeRangeInstant | null): DateTimeRangeDto | null {
    if (dateTimeRange === null) {
      return null
    }

    return {
      startDate: DateTimeInstantTransformer.toDto(dateTimeRange.from),
      endDate: DateTimeInstantTransformer.toDto(dateTimeRange.until),
    }
  }

  static toDtoWithInfinity(dateTimeRange: DateTimeRangeInstantWithInfinity): DateTimeRangeWithInfinityDto
  static toDtoWithInfinity(dateTimeRange: null): null
  static toDtoWithInfinity(
    dateTimeRange: DateTimeRangeInstantWithInfinity | null,
  ): DateTimeRangeWithInfinityDto | null {
    if (dateTimeRange === null) {
      return null
    }

    return {
      startDate: dateTimeRange.from === 'infinity'
        ? '-infinity'
        : DateTimeInstantTransformer.toDto(dateTimeRange.from),
      endDate: dateTimeRange.until === 'infinity'
        ? 'infinity'
        : DateTimeInstantTransformer.toDto(dateTimeRange.until),
    }
  }

  static toField(dateTimeRange: DateTimeRangeInstant, timeZone: TimeZone): DateTimeInstantRangeField
  static toField(dateTimeRange: null, timeZone: TimeZone): null
  static toField(dateTimeRange: DateTimeRangeInstant | null, timeZone: TimeZone): DateTimeInstantRangeField | null
  static toField(dateTimeRange: DateTimeRangeInstant | null, timeZone: TimeZone): DateTimeInstantRangeField | null {
    if (dateTimeRange === null) {
      return null
    }

    const fromDate = DateUtil.instantToPlainDate(dateTimeRange.from, timeZone)
    const fromTime = DateUtil.instantToPlainTime(dateTimeRange.from, timeZone)

    const untilDate = DateUtil.instantToPlainDate(dateTimeRange.until, timeZone)
    const untilTime = DateUtil.instantToPlainTime(dateTimeRange.until, timeZone)

    return {
      from: {
        date: fromDate,
        time: fromTime,
      },
      until: {
        date: untilDate,
        time: untilTime,
      },
    }
  }
}
