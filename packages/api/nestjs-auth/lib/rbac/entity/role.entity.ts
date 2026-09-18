import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm'
import type { RoleUuid } from './role.uuid.js'

/**
 * Shared TypeORM columns for an application-owned role entity.
 *
 * Consumers must decorate their concrete subclass with `@Entity()`; this
 * class intentionally does not create a standalone table.
 */
export abstract class Role<TPermission extends string> {
  @PrimaryGeneratedColumn('uuid')
  uuid: RoleUuid

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar', default: [], array: true })
  permissions: TPermission[]
}
