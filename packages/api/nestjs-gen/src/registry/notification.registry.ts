import { ResolverRegistry } from './helpers/resolver-registry.js'

const notificationResolvers = {
  notificationTypeEnum: {
    glob: 'src/**/notification/enums/notification-types.enum.ts',
    type: 'enum',
    name: 'NotificationType'
  }
} as const

export const NotificationResolverRegistry = new ResolverRegistry(notificationResolvers)
