enum EDITABLE_SEGMENT_PARTS {
  day = 'day',
  dayPeriod = 'dayPeriod',
  hour = 'hour',
  minute = 'minute',
  month = 'month',
  second = 'second',
  year = 'year',
}

enum NON_EDITABLE_SEGMENT_PARTS {
  literal = 'literal',
  timeZoneName = 'timeZoneName',
}

type SegmentPart = EDITABLE_SEGMENT_PARTS | NON_EDITABLE_SEGMENT_PARTS

export interface TimeFieldSegment {
  part: SegmentPart
  value: string
}
