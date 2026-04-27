import type { CurrentUnit } from '@wisemen/quantity'
import {
  Current as BaseCurrent,
  CurrentDto,
} from '@wisemen/quantity'

export class Current extends BaseCurrent {
  getValueIn(unit: CurrentUnit): number {
    return this.asNumber(unit)
  }

  toDto(): CurrentDto {
    return CurrentDto.from(this)
  }

  override toString(unit: CurrentUnit = this.unit): string {
    return `${new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
    }).format(this.getValueIn(unit))} ${unit}`
  }
}
