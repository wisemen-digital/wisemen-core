/* eslint-disable unicorn/no-keyword-prefix */
import type { PayloadLocale } from '@wisemen/payload-core-utils'
import { getLocales } from '@wisemen/payload-core-utils'

type SeededLocale = PayloadLocale

interface SeederLike {
  [key: string]: unknown
}

interface SettingsSeederDependencies<TSeeder extends SeederLike> {
  hasDocumentForTenant: (collection: 'settings') => Promise<boolean>
  createSeeder: (
    name: string,
    shouldRun: () => Promise<boolean>,
    run: () => Promise<void>,
  ) => TSeeder
  ensureDefaultTenantPages: () => Promise<{
    allBlocksTestPage: {
      id: string
    }
    homepage: {
      id: string
    }
  }>
  getDefaultTenant: () => Promise<{
    id: string
  } | null>
  getPayload: () => Promise<{
    create: (input: {
      collection: 'settings'
      data: Record<string, unknown>
      locale: SeededLocale
    }) => Promise<{
      id: string
    }>
    update: (input: {
      id: string
      collection: 'settings'
      data: Record<string, unknown>
      locale: SeededLocale
    }) => Promise<void>
  }>
}

function getPageReference(pageId: string) {
  return {
    newTab: false,
    reference: {
      relationTo: 'pages' as const,
      value: pageId,
    },
    type: 'reference' as const,
  }
}

function createLinkNavItem(id: string, label: string, pageId: string) {
  return {
    id,
    navLink: {
      label,
      link: getPageReference(pageId),
      navType: 'link' as const,
    },
  }
}

function createFooterLink(
  id: string,
  label: string,
  target: {
    pageId: string
    type: 'page'
  },
  variant: 'default' | 'highlighted' = 'default',
) {
  return {
    id,
    label,
    link: target.type === 'page' ? getPageReference(target.pageId) : undefined,
    navType: 'link' as const,
    variant,
  }
}

function getSettingsData(homepageId: string, allBlocksTestPageId: string) {
  return {
    contact: {
      email: 'example@gmail.com',
      phone: 'example phone',
      whatsappLink: 'https://wa.me',
    },
    footer: {
      sections: [
        {
          id: 'footer-section-pages',
          title: 'Pages',
          links: [
            createFooterLink(
              'footer-section-pages-home',
              'Home',
              {
                pageId: homepageId,
                type: 'page',
              },
            ),
            createFooterLink(
              'footer-section-pages-all-blocks',
              'All blocks',
              {
                pageId: allBlocksTestPageId,
                type: 'page',
              },
            ),
          ],
        },
      ],
    },
    general: {
      adminEmail: 'example@gmail.com',
    },
    header: {
      links: [
        createLinkNavItem(
          'header-home',
          'Home',
          homepageId,
        ),
        createLinkNavItem(
          'header-all-blocks',
          'All blocks',
          allBlocksTestPageId,
        ),
      ],
      subheaderLinks: [],
    },
    home: {
      homePage: getPageReference(homepageId),
    },
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      pinterest: 'https://pinterest.com',
      tiktok: 'https://tiktok.com',
      youtube: 'https://youtube.com',
    },
  }
}

export function getSettingsSeeders<TSeeder extends SeederLike>({
  hasDocumentForTenant,
  createSeeder,
  ensureDefaultTenantPages,
  getDefaultTenant,
  getPayload,
}: SettingsSeederDependencies<TSeeder>): TSeeder[] {
  const defaultTenantSettingsSeeder = createSeeder(
    'defaultTenantSettings',
    async () => await hasDocumentForTenant('settings'),
    async () => {
      const payload = await getPayload()
      const tenant = await getDefaultTenant()
      const pages = await ensureDefaultTenantPages()
      const SEEDED_SETTINGS_LOCALES = [
        ...getLocales(),
      ] as SeededLocale[]

      if (!tenant) {
        throw new Error('Default tenant not found')
      }

      const [
        defaultLocale,
        ...secondaryLocales
      ] = SEEDED_SETTINGS_LOCALES

      const settings = await payload.create({
        collection: 'settings',
        data: {
          ...getSettingsData(pages.homepage.id, pages.allBlocksTestPage.id),
          tenant: tenant.id,
        },
        locale: defaultLocale,
      })

      for (const locale of secondaryLocales) {
        await payload.update({
          id: settings.id,
          collection: 'settings',
          data: getSettingsData(pages.homepage.id, pages.allBlocksTestPage.id),
          locale,
        })
      }
    },
  )

  return [
    defaultTenantSettingsSeeder,
  ]
}
