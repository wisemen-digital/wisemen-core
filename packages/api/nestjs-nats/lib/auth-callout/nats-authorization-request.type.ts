export interface NatsAuthorizationRequest {
  server_id: {
    name: string
    host: string
    id: string
    version: string
  }
  user_nkey: string
  client_info: {
    host: string
    id: number
    user: string
    name: string
    kind: string
    type: string
  }
  connect_opts: {
    auth_token: string
    name: string
    lang: string
    version: string
    protocol: number
  }
  type: string
  version: number
}
