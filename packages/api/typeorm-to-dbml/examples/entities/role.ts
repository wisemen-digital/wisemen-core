@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar', default: [], array: true })
  permissions: Permission[]
}
