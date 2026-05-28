import { SpanProcessor, ReadableSpan } from '@opentelemetry/sdk-trace-base'

export class AttributeFilterSpanProcessor implements SpanProcessor {
  private attributesToRemove = [
    // Shared
    'client.name',
    'client.project.name',

    // PgInstrumentation
    'db.connection_string',
    'db.user',

    // NestInstrumentation
    'component',
    'nestjs.callback',
    'nestjs.type',
    'nestjs.version'
  ]

  private keysToRemove = [
    'db_name'
  ]

  onStart(): void {}
  
  onEnd(span: ReadableSpan): void {
    const attributes = span.attributes

    for (let i = 0; i < this.attributesToRemove.length; i++) {
      delete attributes[this.attributesToRemove[i]]
    }

    for (let i = 0; i < this.keysToRemove.length; i++) {
      delete span[this.keysToRemove[i]]
    }
  }

  forceFlush(): Promise<void> {
    return Promise.resolve()
  }

  shutdown(): Promise<void> {
    return Promise.resolve()
  }
}