import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Unique, Index } from 'typeorm'
import type { FeatureFlagUuid } from './feature-flag.uuid.js'
import { GoFeatureFlagConfig } from '../go-feature-flag.config.js'

@Entity({name: 'feature_flag'})
@Unique(['name', 'set'])
export class FeatureFlagEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: FeatureFlagUuid

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Index()
  @Column({ type: 'varchar', length: 255, name: 'flag_name' })
  name: string

  @Index()
  @Column({ type: 'varchar', length: 255, name: 'flagset' })
  set: string

  @Column({ type: 'jsonb' })
  config: GoFeatureFlagConfig
}
