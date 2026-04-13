import * as os from 'node:os'

export function getOtelServiceName (): string {
  const hostName = os.hostname()
  const parts = hostName.split('-')

  return parts.slice(0, parts.length - 2).join('-')
}
