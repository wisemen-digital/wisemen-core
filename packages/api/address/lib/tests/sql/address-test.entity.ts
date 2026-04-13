import { Entity, PrimaryColumn } from 'typeorm'
import { AddressColumn } from '../../address-column.js'
import { Address } from '../../address.js'

@Entity()
export class AddressTest {
  @PrimaryColumn()
  id: number

  @AddressColumn({ nullable: true })
  address: Address | null
}
