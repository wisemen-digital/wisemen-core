// Modules
export { NatsModule } from './nats.module.js'
export type { NatsApplicationModuleOptions } from './nats.module.js'
export { NatsClientModule } from './nats.client.module.js'
export type { NatsClientModuleOptions, NatsClientModuleAsyncOptions } from './nats.client.options.js'

// Simple client (fire-and-forget pub/sub)
export { NatsClient } from './nats.client.js'

// Errors
export { NatsUnavailableError } from './errors/nats-unavailable.error.js'

// Utility
export { natsSubject } from './nats-subject.js'

// CloudEvent model
export { CloudEvent } from './cloud-event/cloud-event.js'

// Connection client decorator
export { NatsConnection } from './connections/nats-connection.decorator.js'
export type { NatsConnectionConfigFunction } from './connections/nats-connection.decorator.js'
export type { NamedConnectionOptions } from './connections/nats-connection.manager.js'

// Stream decorator
export { NatsStream } from './streams/nats-stream.decorator.js'
export type { NatsLimitsStreamConfigFunction, NatsStreamConfigFunction } from './streams/nats-stream.decorator.js'

// Subscriber decorators
export { NatsSubscriber } from './subscribers/nats-subscriber.decorator.js'
export { NatsSubscriberHandler } from './subscribers/nats-subscriber-handler.decorator.js'
export type { NatsSubscriptionOptions, NatsSubscriberConfigFunction } from './subscribers/nats-subscriber.decorator.js'

// Consumer decorators
export { NatsConsumer } from './consumers/nats-consumer.decorator.js'
export { NatsConsumerHandler } from './consumers/nats-consumer-handler.decorator.js'
export type { NatsConsumerConfig, NatsConsumerConfigFunction } from './consumers/nats-consumer.decorator.js'

// Service decorators
export { NatsService } from './services/nats-service.decorator.js'
export { NatsServiceEndpoint } from './services/nats-service-endpoint.decorator.js'
export type { NatsServiceConfig, NatsServiceConfigFunction } from './services/nats-service.decorator.js'

// Message handler method decorators
export { OnNatsMessage } from './message-handler/on-nats-message.decorator.js'
export { OnNatsCloudEvent } from './message-handler/on-nats-cloud-event.decorator.js'
export type { CloudEventHandlerOptions, OnNatsMessageConfig } from './message-handler/on-nats-message.decorator.js'

// Parameter decorators
export { NatsMessage } from './parameters/nats-message.decorator.js'
export { NatsMessageData } from './parameters/nats-message-data.decorator.js'
export { NatsMessageSubject } from './parameters/nats-message-subject.decorator.js'
export { NatsMessageSubjectParam, NatsMessageSubjectUuidParam } from './parameters/nats-message-subject-param.decorator.js'
export { NatsCloudEventData } from './parameters/nats-cloud-event-data.decorator.js'

// Pipes
export { NatsMsgDataJsonPipe } from './parameters/pipes/nats-message-data-json.pipe.js'
export { NatsMsgDataCloudEventPipe } from './parameters/pipes/nats-message-cloud-event.pipe.js'
export { NatsMsgDataCloudEventValidationPipe } from './parameters/pipes/nats-message-cloud-event-validation.pipe.js'
export { NatsMsgDataValidationPipe } from './parameters/pipes/nats-message-data-validation.pipe.js'
export { NatsSubjectParamExistsValidationPipe, NatsSubjectParamMissingError } from './parameters/pipes/nats-subject-param-exists-validation.pipe.js'
export { NatsSubjectParamUuidValidationPipe, NatsSubjectParamInvalidUuidError } from './parameters/pipes/nats-subject-param-uuid-validation.pipe.js'
export type { NatsPipeTransform } from './parameters/pipes/nats-pipe-transform.js'

// Auth callout
export { NatsAuthorizationRequestParser } from './auth-callout/nats-authorization-request-parser.js'
export type { NatsAuthorizationRequest } from './auth-callout/nats-authorization-request.type.js'
export { NatsAuthorizationResponseBuilder } from './auth-callout/nats-authorization-response.js'
export type { ParsedAuthorizationRequest } from './auth-callout/parsed-nats-authorization-request.type.js'
