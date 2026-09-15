import type {
  PushMessage,
  PushProvider,
  PushProviderName,
  PushSendOptions,
  PushSendOutcome,
  PushSendResult,
  PushTarget
} from '../provider/push-provider.types.js'

export interface CapturedPushCall {
  message: PushMessage
  targets: PushTarget[]
  options: PushSendOptions
}

export class FakePushProvider implements PushProvider {
  public readonly calls: CapturedPushCall[] = []
  private readonly outcomes = new Map<string, PushSendOutcome>()
  private readonly failures: Error[] = []

  constructor (public readonly name: PushProviderName = 'fake') {}

  public program (installationUuid: string, outcome: PushSendOutcome): this {
    this.outcomes.set(installationUuid, outcome)

    return this
  }

  public failNextCall (error: Error): this {
    this.failures.push(error)

    return this
  }

  public reset (): void {
    this.calls.length = 0
    this.outcomes.clear()
    this.failures.length = 0
  }

  public send (
    message: PushMessage,
    targets: PushTarget[],
    options: PushSendOptions = {}
  ): Promise<PushSendResult[]> {
    this.calls.push({ message, targets: [...targets], options: { ...options } })

    const failure = this.failures.shift()

    if (failure !== undefined) throw failure

    return Promise.resolve(targets.map(target => ({
      installationUuid: target.installationUuid,
      userUuid: target.userUuid,
      sentTokenGeneration: target.tokenGeneration,
      outcome: this.outcomes.get(target.installationUuid)
        ?? { status: 'accepted', messageId: `fake-${target.installationUuid}` }
    })))
  }

  public get callCount (): number {
    return this.calls.length
  }
}
