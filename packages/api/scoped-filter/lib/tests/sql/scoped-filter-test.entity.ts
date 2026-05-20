import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ScopedFilterTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'uuid' })
  uuid: string
}
