export interface ParsedAuthorizationRequest {
  clientName: string
  userNkey: string
  serverNkey: string
  authToken: string
  xKey?: string
}
