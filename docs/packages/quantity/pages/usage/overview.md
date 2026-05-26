# Overview

`@wisemen/vue-core-quantity` wraps the base `@wisemen/quantity` models with frontend-oriented helpers for conversion, display formatting, and DTO serialization.

## Import

```typescript
import {
  Distance,
  Duration,
  Temperature,
} from '@wisemen/vue-core-quantity'
import {
  DistanceUnit,
  DurationUnit,
  TemperatureUnit,
} from '@wisemen/quantity'
```

## Supported models

| Model | Unit enum | DTO |
| --- | --- | --- |
| `Current` | `CurrentUnit` | `CurrentDto` |
| `Distance` | `DistanceUnit` | `DistanceDto` |
| `Duration` | `DurationUnit` | `DurationDto` |
| `Energy` | `EnergyUnit` | `EnergyDto` |
| `Mass` | `MassUnit` | `MassDto` |
| `Power` | `PowerUnit` | `PowerDto` |
| `Speed` | `SpeedUnit` | `SpeedDto` |
| `Temperature` | `TemperatureUnit` | `TemperatureDto` |
| `Voltage` | `VoltageUnit` | `VoltageDto` |

## Common API

Every exported model supports the base quantity API from `@wisemen/quantity`, plus these frontend helpers:

| Method | Description |
| --- | --- |
| `getValueIn(unit)` | Returns the numeric value converted to the requested unit. |
| `toString(unit?)` | Formats the value with the requested unit. Uses the stored unit when none is passed. |
| `toDto()` | Converts the model to its matching DTO class. |

The inherited base API includes `to`, `asNumber`, `add`, `subtract`, `multiply`, `divide`, `modulo`, comparison helpers, `ceil`, `round`, `floor`, `export`, and `toJSON`.

## Converting values

```typescript
const duration = new Duration(90, DurationUnit.MINUTES)

duration.getValueIn(DurationUnit.HOURS)
// 1.5

duration.to(DurationUnit.SECONDS).value
// 5400
```

## Calculating with quantities

```typescript
const distance = new Distance(1200, DistanceUnit.METER)
const extraDistance = new Distance(800, DistanceUnit.METER)

distance.add(extraDistance).toString(DistanceUnit.KILOMETER)
// '2 km'

distance.isMoreThan(1, DistanceUnit.KILOMETER)
// true
```

## Formatting values

`toString` uses `Intl.NumberFormat` with the runtime locale and rounds to a maximum of one fraction digit.

```typescript
const temperature = new Temperature(25.36, TemperatureUnit.CELSIUS)

temperature.toString()
// '25.4°C'

temperature.toString(TemperatureUnit.FAHRENHEIT)
// '77.6°F'
```

Units supported by `Intl.NumberFormat` are formatted through the platform formatter. Other units fall back to a formatted number followed by the unit string.

## Serializing values

Use `toDto` when sending quantity values to API contracts that use the matching DTO from `@wisemen/quantity`.

```typescript
const distance = new Distance(1500, DistanceUnit.METER)
const dto = distance.toDto()

dto.value
// 1500

dto.unit
// 'm'
```
