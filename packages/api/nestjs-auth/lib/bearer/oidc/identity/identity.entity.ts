import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { IdentityUuid } from './identity.uuid.js'
import { SCHEMA_NAME } from '../../constants.js'

@Entity({schema: SCHEMA_NAME})
@Index(['issuer', 'subject'], { unique: true })
export class Identity<TClaims extends object = object>{
  @PrimaryGeneratedColumn('uuid')
  uuid: IdentityUuid

  @CreateDateColumn({precision: 3})
  createdAt: Date

  @UpdateDateColumn({precision: 3})
  updatedAt: Date

  @Column({type: 'varchar'})
  issuer: string

  @Column({type: 'varchar'})
  subject: string

  /**
   * Allowlisted OIDC claims configured on the trust. A configured claim that
   * is absent from a token is stored as `null`.
   */
  @Column({type: 'jsonb', default: () => "'{}'"})
  claims: TClaims
}
