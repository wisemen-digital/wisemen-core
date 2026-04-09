import type { NatsPipeTransform } from './nats-pipe-transform.js'

export class NatsMsgDataJsonPipe implements NatsPipeTransform {
  private readonly textDecoder = new TextDecoder()

  transform (value: unknown): unknown {
    if (value instanceof Uint8Array) {
      return JSON.parse(this.textDecoder.decode(value))
    } else {
      throw new Error('Could not convert nats message data to json')
    }
  }
}
