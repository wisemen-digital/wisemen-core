import { Injectable } from '@nestjs/common'
import { OneSignalClient } from '../../one-signal.client.js'
import { SendPushNotificationCommand } from './send-push-notification.command.js'

@Injectable()
export class SendPushNotificationUseCase {
  constructor (
    private readonly oneSignalClient: OneSignalClient
  ) {}

  async execute (command: SendPushNotificationCommand): Promise<void> {
    await this.oneSignalClient.sendPushNotification(
      command.name,
      command.title,
      command.description,
      command.userUuids
    )
  }
}
