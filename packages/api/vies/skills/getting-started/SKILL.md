---
name: getting-started
description: Use when validating EU VAT numbers from NestJS APIs.
---

# @wisemen/vies - Getting Started

Use `@wisemen/vies` when a NestJS service needs to validate a VAT number
against the VIES REST API.

## Register The Module

```ts
import { Module } from '@nestjs/common'
import { ViesModule } from '@wisemen/vies'

@Module({
  imports: [ViesModule],
  ...
})
export class CreateBusinessModule {}
```

## Inject `ViesClient`

```ts
import { Injectable } from '@nestjs/common'
import { CountryCode, ViesCheckVatNumberCommandBuilder, ViesClient } from '@wisemen/vies'

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    private viesClient: ViesClient
  ) {}

  ...

  private async validateVat(vatNumber: string, cc: CountryCode) {
    const command = new ViesCheckVatNumberCommandBuilder()
      .withCountryCode(cc)
      .withVatNumber(vatNumber)
      .build()

    return await this.viesClient.checkVatNumber(command)
  }
}
```

`checkVatNumber(...)` returns `ViesCheckVatNumberResponse` and throws
`ViesUnavailableError` when the VIES service is temporarily unavailable.

## Add Requester Details When Needed

```ts
const command = new ViesCheckVatNumberCommandBuilder()
  .withCountryCode(CountryCode.BELGIUM)
  .withVatNumber(vatNumber)
  .withRequesterMemberStateCode(CountryCode.BELGIUM)
  .withRequesterNumber(requesterVatNumber)
  .build()
```

Use requester fields only when you need the extra VIES validation context. For
basic VAT checks, `countryCode` and `vatNumber` are enough.
