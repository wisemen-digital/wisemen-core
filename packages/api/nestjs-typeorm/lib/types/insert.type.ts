import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Default, HasDefault } from './default.type.js'
import { Embedded, IsEmbedded } from './embedded.type.js'
import { IsRelation, Relation } from './relation.js'

type OptionalKeys<T> = {
  [K in keyof T]: null extends T[K]
    ? K
    : HasDefault<T[K]> extends true
      ? K
      : never
}[keyof T]

type RelationKeys<T> = {
  [K in keyof T]: IsRelation<T[K]> extends true
    ? K
    : never
}[keyof T]

type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T> | RelationKeys<T>>

export type EntityInsert<T>
  = { 
      [K in RequiredKeys<T>]: 
        IsEmbedded<T[K]> extends true 
          ? EntityInsert<Omit<T[K], '_embedded'>> 
          : T[K] 
    } // required properties
  & { 
      [K in OptionalKeys<T>]?: 
        IsEmbedded<T[K]> extends true 
          ? EntityInsert<Omit<T[K], '_embedded'>> 
          : T[K] 
    } // optional properties


@Entity()
class TestEntity {
  @Column({ type: 'varchar' })
  requiredColumn: string

  @Column({ type: 'varchar', nullable: true })
  optionalColumn: string | null

  @Column({ type: 'varchar', default: 'default value' })
  defaultColumn: Default<string>

  @Column(() => TestEmbedded)
  embeddedColumn: Embedded<TestEmbedded>

  relation: Relation<string>
}

class TestEmbedded {
  @Column({ type: 'varchar' })
  requiredColumn: string

  @Column({ type: 'varchar', nullable: true })
  optionalColumn: string | null

  @Column({ type: 'varchar', default: 'default value' })
  defaultColumn: Default<string>
}

type TestInsert = EntityInsert<TestEntity>

const _insertOnlyRequired: TestInsert = {
  requiredColumn: 'required value',
  embeddedColumn: {
    requiredColumn: 'required value',
  },
  // relation: 'relation value' <-- not allowed
}

const _insertWithOptionals: TestInsert = {
  requiredColumn: 'required value',
  optionalColumn: 'optional value',
  embeddedColumn: {
    requiredColumn: 'required value',
    optionalColumn: 'optional value',
  }
}

const _insertOverwriteDefaults: TestInsert = {
  requiredColumn: 'required value',
  defaultColumn: 'optional value',
  embeddedColumn: {
    requiredColumn: 'required value',
    defaultColumn: 'optional value',
  }
}