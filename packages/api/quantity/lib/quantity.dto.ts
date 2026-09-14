import { Quantity } from './quantity.js'

export abstract class QuantityDto<Q extends Quantity> {
  abstract parse (): Q
}
