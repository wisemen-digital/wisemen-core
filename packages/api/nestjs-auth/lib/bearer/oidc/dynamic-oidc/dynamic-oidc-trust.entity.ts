import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { OidcTrustUuid } from '../oidc-trust.uuid.js'
import { OidcTrust, ResolvedOidcTrustClaimNames } from '../oidc-trust.js'
import { SCHEMA_NAME } from '../../constants.js'

@Entity({schema: SCHEMA_NAME})
export class DynamicOidcTrust implements OidcTrust{
  @PrimaryGeneratedColumn('uuid')
  id: OidcTrustUuid

  @CreateDateColumn({precision: 3})
  createdAt: Date

  @UpdateDateColumn({precision: 3})
  updatedAt: Date

  @Column({type: 'jsonb'})
  claims: ResolvedOidcTrustClaimNames

  @Index()
  @Column({type: 'varchar'})
  issuer: string

  @Column({type: 'varchar', array: true})
  audiences: string[]

  @Column({type: 'varchar'})
  jwksEndpoint: string
}
