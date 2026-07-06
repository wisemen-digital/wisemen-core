import { LocalizedString, LocalizedStringColumn } from '@wisemen/localized-string'
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { CustomFieldChoice } from '../custom-field-choice.js'
import type { CustomFieldDefinitionFields } from '../custom-field-definition.js'
import type { CustomFieldDefinitionUuid } from '../custom-field-definition.uuid.js'
import type { CustomFieldRules } from '../custom-field-rules.js'
import { CustomFieldType, CustomFieldTypeColumn } from '../enum/custom-field-type.enum.js'
import { CustomFieldChoiceColumn } from './custom-field-choice.column.js'

@Entity()
@Index(['entityType', 'key'], { unique: true, where: '"tenantUuid" IS NULL' })
@Index(['tenantUuid', 'entityType', 'key'], { unique: true, where: '"tenantUuid" IS NOT NULL' })
export class CustomFieldDefinition implements CustomFieldDefinitionFields {
  @PrimaryGeneratedColumn('uuid')
  uuid: CustomFieldDefinitionUuid

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updatedAt: Date

  @Column({ type: 'uuid', nullable: true })
  tenantUuid: string | null

  @Column({ type: 'varchar' })
  entityType: string

  @Column({ type: 'varchar' })
  key: string

  @LocalizedStringColumn()
  label: LocalizedString

  @LocalizedStringColumn({ nullable: true })
  description: LocalizedString | null

  @CustomFieldTypeColumn()
  type: CustomFieldType

  @Column({ type: 'boolean' })
  isRequired: boolean

  @CustomFieldChoiceColumn({ nullable: true })
  choices: CustomFieldChoice[] | null

  @Column({ type: 'jsonb', nullable: true })
  rules: CustomFieldRules | null
}
