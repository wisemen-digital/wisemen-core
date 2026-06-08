import { Column, Entity } from "typeorm"
import { Default } from "../types/default.type.js"
import { Embedded } from "../types/embedded.type.js"
import { EntityInsert } from "../types/entity-insert.type.js"
import { Relation } from "../types/relation.js"

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