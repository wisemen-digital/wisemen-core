import type { BatchResponse, Message, MulticastMessage } from 'firebase-admin/messaging'

/**
 * Injectable boundary between the FCM adapter and the Firebase Admin SDK.
 */
export abstract class FirebaseMessagingGatewayPort {
  /**
   * Set `dryRun` to validate the request without delivering it.
   */
  abstract send (message: Message, dryRun?: boolean): Promise<string>

  abstract sendEachForMulticast (
    message: MulticastMessage,
    dryRun?: boolean
  ): Promise<BatchResponse>
}
