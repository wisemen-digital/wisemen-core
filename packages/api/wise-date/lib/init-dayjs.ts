import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isoWeek from 'dayjs/plugin/isoWeek.js'
import MinMax from 'dayjs/plugin/minMax.js'
import Utc from 'dayjs/plugin/utc.js'
import TimeZone from 'dayjs/plugin/timezone.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import dayOfYear from 'dayjs/plugin/dayOfYear.js'
import isToday from 'dayjs/plugin/isToday.js'
import isTomorrow from 'dayjs/plugin/isTomorrow.js'
import isYesterday from 'dayjs/plugin/isYesterday.js'

export function initDayjs () {
  dayjs.extend(customParseFormat)
  dayjs.extend(isoWeek)
  dayjs.extend(MinMax)
  dayjs.extend(Utc)
  dayjs.extend(TimeZone)
  dayjs.extend(weekOfYear)
  dayjs.extend(dayOfYear)
  dayjs.extend(isToday)
  dayjs.extend(isTomorrow)
  dayjs.extend(isYesterday)
}
