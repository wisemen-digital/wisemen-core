import type { CurrentUnit } from '@wisemen/quantity'
import {
  Current as BaseCurrent,
  CurrentDto,
} from '@wisemen/quantity'

import { formatUnitValue } from '@/models/utils/formatUnit.util'

export class Current extends BaseCurrent {
  getValueIn(unit: CurrentUnit): number {
    return this.asNumber(unit)
  }

  toDto(): CurrentDto {
    return CurrentDto.from(this)
  }

  override toString(unit: CurrentUnit = this.unit): string {
    return formatUnitValue(this.getValueIn(unit), unit)
  }
}
