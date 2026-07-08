/* eslint-disable e18e/prefer-static-regex */
/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
import { TranslateMenuItemsClient } from '@wisemen/payload-core-translate/client'
import type { EditMenuItemsServerProps } from 'payload'

interface TranslateMenuItemsServerPropsExtended extends EditMenuItemsServerProps {
  adapterDefinitions: {
    key: string
    label: string
  }[]
  collectionSlug: string
  endpointPath: string
}

export function TranslateMenuItemsServer({
  id,
  adapterDefinitions,
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
      adapterDefinitions={adapterDefinitions}
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
