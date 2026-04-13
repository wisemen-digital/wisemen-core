import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'int' })
  age: number
}
