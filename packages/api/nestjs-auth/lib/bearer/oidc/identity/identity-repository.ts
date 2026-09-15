import { Injectable } from '@nestjs/common'
import { InjectRepository, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { Identity } from './identity.entity.js'

@Injectable()
export class IdentityRepository {
  constructor (
    @InjectRepository(Identity)
    private readonly repository: TypeOrmRepository<Identity>
  ) { }

  async findByIssuerAndSubject (issuer: string, subject: string): Promise<Identity | null> {
    return await this.repository.findOneBy({ issuer, subject })
  }

  async insert (identity: Identity): Promise<void> {
    await this.repository.insert(identity)
  }
}
