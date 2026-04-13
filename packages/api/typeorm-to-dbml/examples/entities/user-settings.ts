import { User } from "./User"

@Entity()
export class UserSettings {
    @PrimaryGeneratedColumn('uuid')
    uuid: string
    
    @Column({ type: 'uuid' })
    userUuid: string

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_uuid' })
    user: Relation<User>

    @Column({ type: 'enum', enum: UiTheme, default: UiTheme.SYSTEM })
    theme: UiTheme
}