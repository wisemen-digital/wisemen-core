import { Quantity } from './quantity.js'

export abstract class QuantityDto<Q extends Quantity<string, Q>> {
  abstract parse (): Q
}
