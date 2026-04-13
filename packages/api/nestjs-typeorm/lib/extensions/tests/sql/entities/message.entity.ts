import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'timestamp' })
  createdAt: Date

  @Column({ type: 'varchar' })
  message: string
}
