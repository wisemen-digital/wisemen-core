# TimeZone Util

`TimeZoneUtil` contains static helpers for working with IANA time zone identifiers.

## Import

```typescript
import { TimeZoneUtil } from '@wisemen/vue-core-dates'
```

## getCurrentTimeZone

Returns the system's current IANA time zone identifier.

```typescript
TimeZoneUtil.getCurrentTimeZone()
// 'Europe/Brussels'
```

## getAvailableTimeZones

Returns all IANA time zone identifiers supported by the runtime. Returns an empty array in environments that do not support `Intl.supportedValuesOf`.

```typescript
TimeZoneUtil.getAvailableTimeZones()
// ['Africa/Abidjan', 'Africa/Accra', ..., 'Pacific/Wallis']
```

## getOffset

Returns the current UTC offset for a time zone as a formatted string.

```typescript
TimeZoneUtil.getOffset('Europe/Brussels')
// 'GMT+02:00'

TimeZoneUtil.getOffset('America/New_York')
// 'GMT-04:00'
```

## getTimeZoneLabel

Returns the localized long name for a time zone.

```typescript
TimeZoneUtil.getTimeZoneLabel('Europe/Brussels', 'en-US')
// 'Central European Summer Time'

TimeZoneUtil.getTimeZoneLabel('Europe/Brussels', 'nl-BE')
// 'Midden-Europese zomertijd'
```

Falls back to the IANA identifier if the runtime does not produce a time zone name part.
