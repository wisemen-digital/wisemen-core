import { plainToInstance } from 'class-transformer'
import { ColumnOptions, Column } from 'typeorm'
import { Coordinates } from '@wisemen/coordinates'
import { Address } from './address.js'

export function AddressColumn (options?: Omit<ColumnOptions, 'type' | 'transformer'>) {
  return Column({
    ...options,
    type: 'jsonb',
    transformer: {
      from (address: Address | null): Address | null {
        if (address === null) {
          return null
        }

        const addressInstance = plainToInstance(Address, address)
        const coordinates = address.coordinates

        if (coordinates) {
          addressInstance.coordinates = new Coordinates(coordinates.latitude, coordinates.longitude)
        }

        return addressInstance
      },

      to (address: Address | null | undefined): Address | null | undefined {
        return address
      }
    }
  })
}
