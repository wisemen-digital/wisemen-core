---
name: getting-started
description: Use when working with street addresses.
---

# @wisemen/address - Getting Started

Use `Address` as the shared type for street addresses. Use `AddressCommand`
in request DTOs, `@AddressColumn()` in TypeORM entities, and
`AddressResponse` in API responses.

```ts
import { ApiProperty } from '@nestjs/swagger'
import {
  Address,
  AddressBuilder,
  AddressColumn,
  AddressCommand,
  AddressResponse,
  IsAddress,
} from '@wisemen/address'

export class UpdateAddressDto {
  @ApiProperty({ type: AddressCommand })
  @IsAddress({ countryRequired: true, cityRequired: true })
  address: AddressCommand
}

export class CustomerResponse {
  @ApiProperty({ type: AddressResponse, nullable: true })
  address: AddressResponse | null
}

@Entity()
export class Customer {
  @AddressColumn({ nullable: true })
  address: Address | null
}

const address = dto.address.parse()

const fallbackAddress = new AddressBuilder()
  .withCountry('Belgium')
  .withCity('Ghent')
  .build()

return {
  address: new AddressResponse(customer.address ?? fallbackAddress),
}
```
