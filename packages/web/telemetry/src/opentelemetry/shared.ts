import type { Attributes } from '@opentelemetry/api'
import type { Resource } from '@opentelemetry/resources'
import { resourceFromAttributes } from '@opentelemetry/resources'

import type {
  TelemetryOptions,
  TelemetryUser,
} from '@/types.ts'

export function createTelemetryResource(
  options: TelemetryOptions,
): Resource {
  return resourceFromAttributes({
    'deployment.build': options.buildNumber ?? 'unknown',
    'deployment.commit': options.commitHash ?? 'unknown',
    'deployment.environment': options.environment ?? 'unknown',
    'deployment.timestamp': options.buildTimestamp ?? 'unknown',
    'service.name': options.serviceName,
    'service.version': options.serviceVersion ?? 'unknown',
  })
}

export async function createTelemetryHeaders(
  options: TelemetryOptions,
): Promise<Record<string, string>> {
  const accessToken = await options.accessTokenFn()

  return {
    ...(accessToken === ''
      ? {}
      : {
          Authorization: `Bearer ${accessToken}`,
        }),
  }
}

export function createUserAttributes(user: TelemetryUser): Attributes {
  const attributes: Attributes = {}

  if (user.id != null) {
    attributes['enduser.id'] = user.id
  }

  if (user.email != null) {
    attributes['user.email'] = user.email
  }

  return attributes
}
