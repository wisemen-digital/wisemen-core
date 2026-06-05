import { MonetaryApiProperty, MonetaryApiPropertyOptions } from "../monetary.api-property.js"

type MonetaryApiPropertyFactory = 
  (options?: MonetaryApiPropertyOptions) => PropertyDecorator

export function createMonetaryApiProperty (): MonetaryApiPropertyFactory {
  return MonetaryApiProperty
}
