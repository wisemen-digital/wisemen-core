import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class DateTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'timestamptz' })
  date: Date
}
