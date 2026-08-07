import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import { MailProvider } from '../enums/mail-provider.enum.js'

/**
 * Options for configuring a MailPit-backed mail client.
 */
export interface MailPitMailClientOptions {
  /** Selects the MailPit client implementation. */
  type: 'mailpit'
  /** Base URL of the MailPit HTTP API. */
  url: string
  /** Default sender address used when `sendMail()` omits `from`. */
  defaultFrom?: string
  /** Optional HTTP basic auth credentials for protected MailPit instances. */
  auth?: {
    /** MailPit username. */
    username: string
    /** MailPit password. */
    password: string
  }
  /** Optional MailPit tag added to every message. */
  tag?: string
}

/**
 * Options for configuring the Scaleway transactional email client.
 */
export interface ScalewayMailClientOptions {
  /** Selects the Scaleway client implementation. */
  type: MailProvider.SCALEWAY
  /** Scaleway project identifier used for transactional email. */
  projectId: string
  /** Default sender address used when `sendMail()` omits `from`. */
  from: string
  /** Scaleway API token used for authenticated requests. */
  apiKey: string
  /** Scaleway region. Defaults to `fr-par` when omitted. */
  region?: string
}

/**
 * Options for configuring the SendGrid client.
 */
export interface SendGridMailClientOptions {
  /** Selects the SendGrid client implementation. */
  type: MailProvider.SEND_GRID
  /** Default sender address used when `sendMail()` omits `from`. */
  defaultFrom: string
  /** SendGrid API token used for authenticated requests. */
  apiToken: string
}

/**
 * Options for configuring a no-op test client.
 */
export interface MockMailClientOptions {
  /** Selects the mock client implementation. */
  type: 'mock'
}

/**
 * Supported concrete mail client configurations.
 */
export type MailClientOptions =
  | MailPitMailClientOptions
  | ScalewayMailClientOptions
  | SendGridMailClientOptions
  | MockMailClientOptions

/**
 * Synchronous configuration for `MailModule.forRoot(...)`.
 */
export interface MailModuleOptions {
  /**
   * Base path used by `HandlebarsRenderer` to resolve template file paths.
   *
   * Defaults to `<cwd>/dist/src/modules`.
   */
  templateRootPath?: string
  /** Concrete mail client configuration to register in Nest DI. */
  client: MailClientOptions

  /** The pgboss queue name which is registered on the pgboss jobs that are part of this package */
  queueName: string
}

/**
 * Async configuration for `MailModule.forRootAsync(...)`.
 */
export interface MailModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Optional modules that should be imported before resolving the factory.
   */
  imports?: ModuleMetadata['imports']
  /**
   * Factory that resolves the module options from config, secrets, feature
   * flags, or test setup.
   */
  useFactory: (...args: unknown[]) => Promise<MailModuleOptions> | MailModuleOptions
  /** Dependencies injected into `useFactory`. */
  inject?: FactoryProvider['inject']
}
