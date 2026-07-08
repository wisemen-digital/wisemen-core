import { randomUUID } from 'node:crypto'
import * as os from 'node:os'

export type DomainEventOptions<Content extends object = object> = {
  content: Content
  subjectType?: string
  subjectId?: string
}

export type SubjectedEventOptions<Content extends object, CustomOptions = object>
  = Omit<DomainEventOptions<Content>, 'subjectType' | 'subjectId'> & CustomOptions

export class DomainEvent<Content extends object = object> {
  readonly id: string
  readonly createdAt: Date
  readonly content: Content
  readonly version: number
  readonly source: string
  readonly type: string
  readonly subjectType?: string
  readonly subjectId?: string

  constructor (options: DomainEventOptions<Content>) {
    this.id = randomUUID()
    this.createdAt = new Date()
    this.content = options.content
    this.source = os.hostname()
    this.subjectId = options.subjectId
    this.subjectType = options.subjectType
  }
}
