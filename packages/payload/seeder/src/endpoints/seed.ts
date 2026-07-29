import type { Endpoint } from 'payload'

import { isAllowed } from '#_kit'
import { runSeed } from '#engine/run'
import {
  SeedRunError,
  SeedValidationError,
} from '#engine/validate'
import {
  SEED_DISABLED_MESSAGE,
  seedingEnabled,
} from '#guard'
import type { ResolvedSeedOptions } from '#types'

export function createSeedEndpoint(options: ResolvedSeedOptions): Endpoint {
  return {
    handler: async (req) => {
      if (!seedingEnabled()) {
        return Response.json({
          error: SEED_DISABLED_MESSAGE,
        }, {
          status: 403,
        })
      }
      if (!(await isAllowed(options.options.access.run, req))) {
        return Response.json({
          error: 'Seeding requires an authenticated Payload user (any user) - log in first.',
        }, {
          status: 403,
        })
      }

      try {
        const result = await runSeed({
          definitions: options.definitions,
          options,
          payload: req.payload,
          req,
        })
        const message = options.definitions?.length ? undefined : '0 documents created — no seed definitions registered'

        return Response.json({
          success: true,
          ...(message
            ? {
                message,
              }
            : {}),
          ...result,
        })
      }
      catch (error) {
        req.payload.logger.error({
          err: error,
          msg: 'Error seeding data',
        })

        if (error instanceof SeedValidationError) {
          return Response.json({
            issues: error.issues,
            error: 'Seed validation failed.',
          }, {
            status: 400,
          })
        }
        if (error instanceof SeedRunError) {
          return Response.json({
            issues: [
              error.detail,
            ],
            error: 'Error seeding data.',
          }, {
            status: 500,
          })
        }

        return Response.json({
          error: 'Error seeding data.',
        }, {
          status: 500,
        })
      }
    },
    method: 'post',
    path: '/seed',
  }
}
