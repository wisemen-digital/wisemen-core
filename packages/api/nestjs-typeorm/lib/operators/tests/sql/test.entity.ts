import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class TestEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'int' })
  age: number

  @Column({ type: 'varchar', nullable: true })
  email?: string

  @Column({ type: 'varchar', nullable: true })
  city?: string
}
