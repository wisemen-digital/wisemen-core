import { Injectable } from '@nestjs/common'
import type { BasicAuthCredential, BasicAuthDefinitions } from './basic-auth.types.js'

@Injectable()
export class BasicAuthRegistry {
  readonly definitions: BasicAuthDefinitions = {}

  register (definitions: BasicAuthDefinitions): void {
    for (const [name, definition] of Object.entries(definitions)) {
      this.registerDefinition(name, definition)
    }
  }

  private registerDefinition (name: string, definition: BasicAuthCredential): void {
    if(definition.username.length === 0 || definition.password.length === 0){
      throw new Error('cannot provide empty basic credentials')
    }

    const existing = this.definitions[name]

    if (
      existing !== undefined
      && (existing.username !== definition.username || existing.password !== definition.password)
    ) {
      throw new Error(`Basic Auth definition "${name}" is already registered`)
    }

    this.definitions[name] = definition
  }
}
