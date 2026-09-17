import { Inject, Injectable, Logger, type OnModuleDestroy } from '@nestjs/common'
import { type App, applicationDefault, deleteApp, getApps, initializeApp } from 'firebase-admin/app'
import {
  type BatchResponse,
  getMessaging,
  type Message,
  type Messaging,
  type MulticastMessage
} from 'firebase-admin/messaging'
import { FirebaseMessagingGatewayPort } from './firebase-messaging.gateway-port.js'
import {
  FCM_PUSH_MODULE_OPTIONS,
  type FcmPushModuleOptions
} from './fcm-push-module-options.js'

/**
 * Firebase Admin SDK backed gateway.
 *
 * Initializes Firebase on the first send using Application Default Credentials. It reuses an
 * existing app with the configured name and only deletes apps it created itself.
 */
@Injectable()
export class FirebaseMessagingGateway extends FirebaseMessagingGatewayPort implements OnModuleDestroy {
  private readonly logger = new Logger(FirebaseMessagingGateway.name)
  private _messaging: Messaging | null = null
  private ownedApp: App | null = null

  constructor (
    @Inject(FCM_PUSH_MODULE_OPTIONS) private readonly options: FcmPushModuleOptions
  ) {
    super()
  }

  public async send (message: Message, dryRun = false): Promise<string> {
    return await this.messaging.send(message, dryRun)
  }

  public async sendEachForMulticast (
    message: MulticastMessage,
    dryRun = false
  ): Promise<BatchResponse> {
    return await this.messaging.sendEachForMulticast(message, dryRun)
  }

  public async onModuleDestroy (): Promise<void> {
    this._messaging = null

    if (this.ownedApp !== null) {
      await deleteApp(this.ownedApp)
      this.ownedApp = null
    }
  }

  private get messaging (): Messaging {
    this._messaging ??= getMessaging(this.getApp())

    return this._messaging
  }

  private getApp (): App {
    const existing = getApps().find(candidate => candidate.name === this.options.appName)

    if (existing !== undefined) {
      return existing
    }

    const projectId = this.options.projectId.trim()

    if (projectId === '') {
      throw new Error('FcmPushModule requires a non-empty projectId')
    }

    this.logger.log(`Initializing Firebase app for project ${projectId}`)

    this.ownedApp = initializeApp({
      credential: applicationDefault(),
      projectId
    }, this.options.appName)

    return this.ownedApp
  }
}
