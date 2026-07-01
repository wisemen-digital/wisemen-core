/* eslint-disable e18e/prefer-static-regex */
/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
import type { EditMenuItemsServerProps } from 'payload'

import { TranslateMenuItemsClient } from '#components/translateMenuItems.client.tsx'

interface TranslateMenuItemsServerPropsExtended extends EditMenuItemsServerProps {
  collectionSlug: string
  endpointPath: string
}

export function TranslateMenuItemsServer({
  id,
  collectionSlug,
  endpointPath,
  locale,
  payload,
}: TranslateMenuItemsServerPropsExtended) {
  if (!id || !locale || !payload.config.localization) {
    return null
  }

  const locales = payload.config.localization.locales.map((entry) => ({
    code: entry.code,
    label: typeof entry.label === 'string' ? entry.label : entry.label[locale.code] ?? entry.code,
  }))
  const apiRoute = payload.config.routes?.api ?? '/api'

  return (
    <TranslateMenuItemsClient
      currentLocale={locale.code}
      documentID={id}
      endpointPath={joinPathSegments(apiRoute, endpointPath, collectionSlug)}
      locales={locales}
    />
  )
}

function joinPathSegments(...segments: string[]): string {
  return segments
    .map((segment, index) => {
      if (index === 0) {
        return segment.replace(/\/+$/, '') || '/'
      }

      return segment.replace(/^\/+|\/+$/g, '')
    })
    .filter(Boolean)
    .join('/')
}
