import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import type { ApiKeyUuid } from './api-key.uuid.js'
import { SCHEMA_NAME } from '../constants.js'
import { Default } from '@wisemen/nestjs-typeorm'

@Entity({schema: SCHEMA_NAME})
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  uuid: Default<ApiKeyUuid>

  @CreateDateColumn({ precision: 3, type: 'timestamptz' })
  createdAt: Default<Date>

  @DeleteDateColumn({ type: 'timestamptz', precision: 3, nullable: true })
  deletedAt: Date | null

  @Column({ type: 'timestamptz', precision: 3, nullable: true })
  expiresAt: Date | null

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', unique: true })
  secretHash: string

  @Column({ type: 'varchar' })
  secretLastChars: string
}
