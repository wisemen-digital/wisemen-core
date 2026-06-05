/* eslint-disable vue/max-len */
import type {
  DateTimeInstantRange,
  DateTimeInstantRangeWithEndInfinity,
  DateTimeInstantRangeWithInfinity,
  DateTimeInstantRangeWithStartInfinity,
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
  from: string
  until: string
}

interface DateTimeRangeWithInfinityDto {
  from: string | '-infinity' | 'infinity'
  until: string | '-infinity' | 'infinity'
}

export class DateTimeInstantRangeTransformer {
  static fieldToDto(field: DateTimeInstantRangeField, timeZone: TimeZone): DateTimeRangeDto
  static fieldToDto(field: NullableDateTimeInstantRangeField, timeZone: TimeZone): DateTimeRangeDto | null
  static fieldToDto(field: DateTimeInstantRangeField | NullableDateTimeInstantRangeField, timeZone: TimeZone): DateTimeRangeDto | null {
    if (field.from.date === null || field.from.time === null || field.until.date === null || field.until.time === null) {
      return null
    }

    return {
      from: DateTimeInstantTransformer.toDto(
        DateUtil.instantFromDateAndTime(field.from.date, field.from.time, timeZone),
      ),
      until: DateTimeInstantTransformer.toDto(
        DateUtil.instantFromDateAndTime(field.until.date, field.until.time, timeZone),
      ),
    }
  }

  static fieldWithNullableEndToDto(field: DateTimeInstantRangeWithNullableEndField, timeZone: TimeZone): DateTimeRangeWithInfinityDto {
    return {
      from: DateTimeInstantTransformer.toDto(DateUtil.instantFromDateAndTime(field.from.date, field.from.time, timeZone)),
      until: field.until.date === null || field.until.time === null
        ? 'infinity'
        : DateTimeInstantTransformer.toDto(DateUtil.instantFromDateAndTime(field.until.date, field.until.time, timeZone)),
    }
  }

  static fieldWithNullableStartToDto(field: DateTimeInstantRangeWithNullableStartField, timeZone: TimeZone): DateTimeRangeWithInfinityDto {
    return {
      from: field.from.date === null || field.from.time === null
        ? '-infinity'
        : DateTimeInstantTransformer.toDto(DateUtil.instantFromDateAndTime(field.from.date, field.from.time, timeZone)),
      until: DateTimeInstantTransformer.toDto(DateUtil.instantFromDateAndTime(field.until.date, field.until.time, timeZone)),
    }
  }

  static fromDto(dto: DateTimeRangeDto): DateTimeInstantRange
  static fromDto(dto: null): null
  static fromDto(dto: DateTimeRangeDto | null): DateTimeInstantRange | null
  static fromDto(dto: DateTimeRangeDto | null): DateTimeInstantRange | null {
    if (dto === null) {
      return null
    }

    return {
      from: DateUtil.instantFrom(dto.from),
      until: DateUtil.instantFrom(dto.until),
    }
  }

  static fromDtoWithEndInfinity(dto: DateTimeRangeWithInfinityDto): DateTimeInstantRangeWithEndInfinity
  static fromDtoWithEndInfinity(dto: null): null
  static fromDtoWithEndInfinity(dto: DateTimeRangeWithInfinityDto | null): DateTimeInstantRangeWithEndInfinity | null
  static fromDtoWithEndInfinity(
    dto: DateTimeRangeWithInfinityDto | null,
  ): DateTimeInstantRangeWithEndInfinity | null {
    if (dto === null) {
      return null
    }

    if (DateTimeInstantRangeTransformer.isInfinity(dto.from)) {
      throw new Error(`fromDtoWithEndInfinity: from cannot be infinity, got "${dto.from}"`)
    }

    return {
      from: DateUtil.instantFrom(dto.from),
      until: DateTimeInstantRangeTransformer.isInfinity(dto.until)
        ? 'infinity'
        : DateUtil.instantFrom(dto.until),
    }
  }

  static fromDtoWithInfinity(dto: DateTimeRangeWithInfinityDto): DateTimeInstantRangeWithInfinity
  static fromDtoWithInfinity(dto: null): null
  static fromDtoWithInfinity(dto: DateTimeRangeWithInfinityDto | null): DateTimeInstantRangeWithInfinity | null
  static fromDtoWithInfinity(dto: DateTimeRangeWithInfinityDto | null): DateTimeInstantRangeWithInfinity | null {
    if (dto === null) {
      return null
    }

    return {
      from: DateTimeInstantRangeTransformer.isInfinity(dto.from)
        ? 'infinity'
        : DateUtil.instantFrom(dto.from),
      until: DateTimeInstantRangeTransformer.isInfinity(dto.until)
        ? 'infinity'
        : DateUtil.instantFrom(dto.until),
    }
  }

  static fromDtoWithStartInfinity(dto: DateTimeRangeWithInfinityDto | null): DateTimeInstantRangeWithStartInfinity | null
  static fromDtoWithStartInfinity(dto: DateTimeRangeWithInfinityDto): DateTimeInstantRangeWithStartInfinity
  static fromDtoWithStartInfinity(dto: null): null
  static fromDtoWithStartInfinity(
    dto: DateTimeRangeWithInfinityDto | null,
  ): DateTimeInstantRangeWithStartInfinity | null {
    if (dto === null) {
      return null
    }

    if (DateTimeInstantRangeTransformer.isInfinity(dto.until)) {
      throw new Error(`fromDtoWithStartInfinity: until cannot be infinity, got "${dto.until}"`)
    }

    return {
      from: DateTimeInstantRangeTransformer.isInfinity(dto.from)
        ? 'infinity'
        : DateUtil.instantFrom(dto.from),
      until: DateUtil.instantFrom(dto.until),
    }
  }

  static isInfinity(value: any): value is '-infinity' | 'infinity' {
    return value === 'infinity' || value === '-infinity'
  }

  static toDto(dateTimeRange: DateTimeInstantRange): DateTimeRangeDto
  static toDto(dateTimeRange: null): null
  static toDto(dateTimeRange: DateTimeInstantRange | null): DateTimeRangeDto | null {
    if (dateTimeRange === null) {
      return null
    }

    return {
      from: DateTimeInstantTransformer.toDto(dateTimeRange.from),
      until: DateTimeInstantTransformer.toDto(dateTimeRange.until),
    }
  }

  static toDtoWithInfinity(dateTimeRange: DateTimeInstantRangeWithInfinity): DateTimeRangeWithInfinityDto
  static toDtoWithInfinity(dateTimeRange: null): null
  static toDtoWithInfinity(
    dateTimeRange: DateTimeInstantRangeWithInfinity | null,
  ): DateTimeRangeWithInfinityDto | null {
    if (dateTimeRange === null) {
      return null
    }

    return {
      from: dateTimeRange.from === 'infinity'
        ? '-infinity'
        : DateTimeInstantTransformer.toDto(dateTimeRange.from),
      until: dateTimeRange.until === 'infinity'
        ? 'infinity'
        : DateTimeInstantTransformer.toDto(dateTimeRange.until),
    }
  }

  static toField(dateTimeRange: DateTimeInstantRange, timeZone: TimeZone): DateTimeInstantRangeField
  static toField(dateTimeRange: null, timeZone: TimeZone): null
  static toField(dateTimeRange: DateTimeInstantRange | null, timeZone: TimeZone): DateTimeInstantRangeField | null
  static toField(dateTimeRange: DateTimeInstantRange | null, timeZone: TimeZone): DateTimeInstantRangeField | null {
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
