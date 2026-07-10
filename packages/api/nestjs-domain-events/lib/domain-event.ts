import { randomUUID } from 'node:crypto'
import * as os from 'node:os'

export type DomainEventOptions<Content extends object = object, TUuid extends string = string> = {
  content: Content
  subjectType?: string
  subjectId?: string
  tenantUuid?: TUuid
}

export type SubjectedEventOptions<
  Content extends object, 
  CustomOptions = object,
  TUuid extends string = string
> = Omit<DomainEventOptions<Content, TUuid>, 'subjectType' | 'subjectId'> & CustomOptions

export class DomainEvent<Content extends object = object, TUuid extends string = string> {
  readonly id: string
  readonly createdAt: Date
  readonly content: Content
  readonly version: number
  readonly source: string
  readonly type: string
  readonly subjectType?: string
  readonly subjectId?: string
  readonly tenantUuid?: TUuid

  constructor (options: DomainEventOptions<Content, TUuid>) {
    this.id = randomUUID()
    this.createdAt = new Date()
    this.content = options.content
    this.source = os.hostname()
    this.subjectId = options.subjectId
    this.subjectType = options.subjectType
    this.tenantUuid = options.tenantUuid
  }
}
