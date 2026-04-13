# @wisemen/address

TypeScript address model with NestJS integration, TypeORM column support, and validation.

## Installation

```bash
pnpm add @wisemen/address
```

## Usage

### Basic Address Model

```typescript
import { Address } from '@wisemen/address'

const address = new Address()
address.placeName = 'Home'
address.streetName = 'Main Street'
address.streetNumber = '123'
address.city = 'New York'
address.postalCode = '10001'
address.country = 'USA'
```

### TypeORM Column

```typescript
import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AddressColumn } from '@wisemen/address'

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @AddressColumn({ nullable: true })
  address: Address | null
}
```

### NestJS DTO Validation

```typescript
import { AddressCommand } from '@wisemen/address'

class CreateUserDto {
  @ValidateNested()
  @Type(() => AddressCommand)
  address: AddressCommand
}
```

### NestJS Response

```typescript
import { AddressResponse } from '@wisemen/address'

@Get()
async getUser(): Promise<UserResponse> {
  const user = await this.userService.findOne()
  return {
    id: user.id,
    address: user.address ? new AddressResponse(user.address) : null
  }
}
```

### Custom Validator

```typescript
import { IsAddress } from '@wisemen/address'

class LocationDto {
  @IsAddress()
  address: Address
}
```

## License

GPL
