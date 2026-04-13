import { Role } from "./role"
import { User } from "./user"

@Entity()
@Unique(['userUuid', 'roleUuid'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'uuid' })
  userUuid: string

  @Index()
  @Column({ type: 'uuid' })
  roleUuid: string

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: 'user_uuid' })
  user?: Relation<User>

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_uuid' })
  role?: Relation<Role>
}
