# Models

Each model stores the original `value` and `unit`, while conversions are calculated through the base quantity implementation.

## Distance

```typescript
import { Distance } from '@wisemen/vue-core-quantity'
import { DistanceUnit } from '@wisemen/quantity'

const distance = new Distance(2500, DistanceUnit.METER)

distance.getValueIn(DistanceUnit.KILOMETER)
// 2.5

distance.toString(DistanceUnit.KILOMETER)
// '2.5 km'
```

## Duration

```typescript
import { Duration } from '@wisemen/vue-core-quantity'
import { DurationUnit } from '@wisemen/quantity'

const duration = new Duration(120, DurationUnit.SECONDS)

duration.getValueIn(DurationUnit.MINUTES)
// 2

duration.toString(DurationUnit.MINUTES)
// '2 min'
```

## Temperature

```typescript
import { Temperature } from '@wisemen/vue-core-quantity'
import { TemperatureUnit } from '@wisemen/quantity'

const temperature = new Temperature(0, TemperatureUnit.CELSIUS)

temperature.getValueIn(TemperatureUnit.FAHRENHEIT)
// 32

temperature.toString(TemperatureUnit.FAHRENHEIT)
// '32°F'
```

## Mass

```typescript
import { Mass } from '@wisemen/vue-core-quantity'
import { MassUnit } from '@wisemen/quantity'

const mass = new Mass(2.5, MassUnit.KILOGRAM)

mass.getValueIn(MassUnit.GRAM)
// 2500

mass.toString(MassUnit.GRAM)
// '2,500 g'
```

## Speed

```typescript
import { Speed } from '@wisemen/vue-core-quantity'
import { SpeedUnit } from '@wisemen/quantity'

const speed = new Speed(36, SpeedUnit.KILOMETER_PER_HOUR)

speed.getValueIn(SpeedUnit.METER_PER_SECOND)
// 10

speed.toString(SpeedUnit.METER_PER_SECOND)
// '10 m/s'
```

## Energy and power

```typescript
import {
  Energy,
  Power,
} from '@wisemen/vue-core-quantity'
import {
  EnergyUnit,
  PowerUnit,
} from '@wisemen/quantity'

const energy = new Energy(1, EnergyUnit.KILOWATT_HOUR)
const power = new Power(2500, PowerUnit.WATT)

energy.getValueIn(EnergyUnit.JOULE)
// 3600000

power.toString(PowerUnit.KILOWATT)
// '2.5 kW'
```

## Current and voltage

```typescript
import {
  Current,
  Voltage,
} from '@wisemen/vue-core-quantity'
import {
  CurrentUnit,
  VoltageUnit,
} from '@wisemen/quantity'

const current = new Current(1, CurrentUnit.AMPERE)
const voltage = new Voltage(11000, VoltageUnit.VOLT)

current.getValueIn(CurrentUnit.MILLIAMPERE)
// 1000

voltage.toString(VoltageUnit.KILOVOLT)
// '11 kV'
```
