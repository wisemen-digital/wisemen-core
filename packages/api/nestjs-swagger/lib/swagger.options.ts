
export interface SwaggerDocsOptions {
  /**
   * Applies a `@wisemen/nestjs-auth` basic auth middleware set.
   * Defaults to no basic auth.
   */
  basicAuth?: string

  /**
   * The base route to attach the swagger routes on.
   * Defaults to `/api/docs`
   */
  route?: string

  /** 
   * Endpoint where OIDC configuration can be discovered
   * @see https://connect2id.com/products/server/docs/api/discovery#metadata
   * 
   * If no url is specified, no OIDC config is set on the swagger docs.
   */
  oidcUrl?: string

  /**
   * The amount of milliseconds before the OIDC config fetch request times out.
   * Defaults to 5000ms
   */
  oidcTimeout?: number

  /**
   * Specify the server where the api is hosted.
   * This is used to build the redirect url (`serverUrl + "/api/oauth2-redirect"`)
   * 
   * @pre SwaggerModule.forRoot(...) needs to be registered on this server.
   * 
   * @example localhost:3000
   */
  redirectServer?: string

  /**
   * Specify the servers where the api is hosted.
   * 
   * @example localhost:3000
   */
  servers: string[]

  /**
   * A record of additional scopes with descriptions.
   * By default the OIDC config is used for the scopes.
   * 
   * OIDC config scopes are overridden when redefined in the additional scopes. 
   */
  additionalScopes?: Record<string, string>
}

export class SwaggerConfig {
  readonly route: string
  readonly oidcUrl: string | undefined
  readonly oidcTimeout: number
  readonly redirectServer: string | undefined
  readonly servers: string[]
  readonly additionalScopes: Record<string,string> | undefined

  constructor(options: SwaggerDocsOptions) {
    this.route = options.route ?? '/api/docs'
    this.oidcUrl = options.oidcUrl
    this.oidcTimeout = options.oidcTimeout ?? 5000 //ms
    this.redirectServer = options.redirectServer
    this.servers = options.servers
    this.additionalScopes = options.additionalScopes
  }
}