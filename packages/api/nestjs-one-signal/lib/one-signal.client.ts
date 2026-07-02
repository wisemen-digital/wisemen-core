import { Inject, Injectable } from '@nestjs/common'
import * as OneSignal from '@onesignal/node-onesignal'
import { captureException } from '@wisemen/opentelemetry'
import { OneSignalUnavailableError } from './errors/one-signal-unavailable.error.js'
import { ONE_SIGNAL_CLIENT_OPTIONS_TOKEN } from './tokens.js'
import type { OneSignalClientModuleOptions } from './one-signal.client.options.js'

@Injectable()
export class OneSignalClient {
  private readonly _client?: OneSignal.DefaultApi

  constructor (
    @Inject(ONE_SIGNAL_CLIENT_OPTIONS_TOKEN)
    private readonly options: OneSignalClientModuleOptions
  ) {
    try {
      const configuration = OneSignal.createConfiguration({
        restApiKey: this.options.apiKey
      })

      this._client = new OneSignal.DefaultApi(configuration)
    } catch (error) {
      captureException(error)
    }
  }

  private get client (): OneSignal.DefaultApi {
    if (!this._client) {
      throw new OneSignalUnavailableError('OneSignal client is not configured')
    } else {
      return this._client
    }
  }

  private getDefaultAppId (): string {
    if (!this.options.appId) {
      throw new OneSignalUnavailableError('OneSignal app id is not configured')
    }

    return this.options.appId
  }

  public async sendPushNotification (
    name: string,
    headings: OneSignal.LanguageStringMap,
    contents: OneSignal.LanguageStringMap,
    userUuids: string[],
    data?: Record<string, unknown>
  ): Promise<void> {
    const notification = new OneSignal.Notification()

    notification.app_id = this.getDefaultAppId()
    notification.name = name
    notification.headings = headings
    notification.contents = contents
    notification.target_channel = 'push'
    notification.include_aliases = {
      external_id: userUuids
    }
    notification.data = data

    await this.client.createNotification(notification)
  }
}
