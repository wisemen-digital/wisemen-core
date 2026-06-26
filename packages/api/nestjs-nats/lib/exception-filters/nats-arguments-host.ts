import type { ArgumentsHost } from '@nestjs/common'
import type { JsMsg } from '@nats-io/jetstream'
import type { ServiceMsg } from '@nats-io/services'
import type { Msg } from '@nats-io/transport-node'

export type NatsContextMessage = Msg | JsMsg | ServiceMsg

export interface NatsContextHost {
  getHandlerName (): string | undefined
  getMessage<TMessage extends NatsContextMessage = NatsContextMessage> (): TMessage
  getSubject (): string
}

export interface NatsArgumentsHost extends ArgumentsHost {
  getType<TContext extends string = 'nats'> (): TContext
  switchToNats (): NatsContextHost
}

type HttpArgumentsHost = ReturnType<ArgumentsHost['switchToHttp']>
type RpcArgumentsHost = ReturnType<ArgumentsHost['switchToRpc']>
type WsArgumentsHost = ReturnType<ArgumentsHost['switchToWs']>

export class NatsExecutionContextHost implements NatsArgumentsHost {
  private readonly message: NatsContextMessage
  private responded = false

  constructor (
    message: NatsContextMessage,
    private readonly handlerName?: string
  ) {
    this.message = this.wrapMessage(message)
  }

  get hasResponded (): boolean {
    return this.responded
  }

  getArgs<T extends unknown[] = unknown[]> (): T {
    return [this.message] as T
  }

  getArgByIndex<T = unknown> (index: number): T {
    return this.getArgs()[index] as T
  }

  switchToHttp (): HttpArgumentsHost {
    return {
      getNext: <T = unknown> (): T => undefined as T,
      getRequest: <T = unknown> (): T => undefined as T,
      getResponse: <T = unknown> (): T => undefined as T
    }
  }

  switchToRpc (): RpcArgumentsHost {
    return {
      getContext: <T = unknown> (): T => this.message as T,
      getData: <T = unknown> (): T => this.message as T
    }
  }

  switchToWs (): WsArgumentsHost {
    return {
      getClient: <T = unknown> (): T => undefined as T,
      getData: <T = unknown> (): T => this.message as T,
      getPattern: <T = unknown> (): T => this.message.subject as T
    }
  }

  getType<TContext extends string = 'nats'> (): TContext {
    return 'nats' as TContext
  }

  switchToNats (): NatsContextHost {
    return {
      getHandlerName: () => this.handlerName,
      getMessage: <TMessage extends NatsContextMessage = NatsContextMessage> (): TMessage => this.message as TMessage,
      getSubject: () => this.message.subject
    }
  }

  private wrapMessage (message: NatsContextMessage): NatsContextMessage {
    if (!this.isServiceMessage(message)) {
      return message
    }

    return new Proxy(message, {
      get: (target, property, receiver) => {
        if (property === 'respond' || property === 'respondError') {
          const original = Reflect.get(target, property, receiver) as (...args: unknown[]) => unknown

          return (...args: unknown[]) => {
            this.responded = true

            return original.apply(target, args)
          }
        }

        return Reflect.get(target, property, receiver)
      }
    })
  }

  private isServiceMessage (message: NatsContextMessage): message is ServiceMsg {
    return typeof (message as ServiceMsg).respondError === 'function'
  }
}
