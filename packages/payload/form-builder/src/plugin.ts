import type { Plugin } from 'payload'

import {
  createFormsCollection,
  createSubmissionsCollection,
} from '#collections.ts'
import type { FormBuilderOptions } from '#types.ts'

/** Adds a user-configurable forms collection and a readable submissions inbox. */
export function formBuilderPlugin(options: FormBuilderOptions = {}): Plugin {
  return (config) => ({
    ...config,
    collections: [
      ...(config.collections ?? []),
      createFormsCollection(options),
      createSubmissionsCollection(options),
    ],
  })
}
