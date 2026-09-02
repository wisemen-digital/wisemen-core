import { BasicAuthCredential } from './basic-auth.types.js'

export function parseBasicAuthHeader (header: string | undefined): BasicAuthCredential | null {
  if (header === undefined) {
    return null
  }

  if (!header.startsWith('Basic ')) {
    return null
  }

  const base64Credential = header.split(' ')[1]
  const [username, password] = Buffer.from(base64Credential, 'base64').toString('utf-8').split(':')

  return { username, password }
}