import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CsvEncodeStreamTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'integer' })
  age: number

  @Column({ type: 'text', nullable: true })
  note: string | null
}
