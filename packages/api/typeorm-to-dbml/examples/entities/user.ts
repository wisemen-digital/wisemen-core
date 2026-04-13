import { UserRole } from "./user-role";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column()
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({ type: 'jsonb' })
  customFields: object

  @OneToMany(() => UserRole, role => role.user)
  userRoles?: Array<Relation<UserRole>>
}
