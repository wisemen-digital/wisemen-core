import { Injectable } from '@nestjs/common'
import { InjectRepository, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { ArrayOverlap } from 'typeorm'
import { DynamicOidcTrust } from './dynamic-oidc-trust.entity.js'

@Injectable()
export class DynamicOidcTrustRepository {
  constructor (
    @InjectRepository(DynamicOidcTrust)
    private readonly repository: TypeOrmRepository<DynamicOidcTrust>
  ) { }

  async findByIssuerAndAudiences (
    issuer: string,
    audiences: readonly string[]
  ): Promise<DynamicOidcTrust | null> {
    return await this.repository.findOneBy({
      issuer,
      audiences: ArrayOverlap([...audiences])
    })
  }
}
