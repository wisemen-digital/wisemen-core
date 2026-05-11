import { useI18n } from 'vue-i18n'

import type { ActionGroup } from '#types/actionGroup.type'

export enum GroupPriority {
  HOVER = 1,
  VIEW = 2,
  MODEL = 3,
  GENERAL = 4,
  NAVIGATION = 5,
  PREFERENCES = 6,
  ACCOUNT = 7,
  DEVELOPER = 8,
}

export function useActionGroup() {
  const i18n = useI18n()

  return {
    account: {
      name: i18n.t('action.group.account'),
      priority: GroupPriority.ACCOUNT,
    },
    contact: {
      name: i18n.t('action.group.contact'),
      priority: GroupPriority.MODEL,
    },
    developer: {
      name: i18n.t('action.group.developer'),
      priority: GroupPriority.DEVELOPER,
    },
    general: {
      name: i18n.t('action.group.general'),
      priority: GroupPriority.GENERAL,
    },
    navigation: {
      name: i18n.t('action.group.navigation'),
      priority: GroupPriority.NAVIGATION,
    },
    preferences: {
      name: i18n.t('action.group.preferences'),
      priority: GroupPriority.PREFERENCES,
    },
    user: {
      name: i18n.t('action.group.user'),
      priority: GroupPriority.MODEL,
    },
  } satisfies Record<string, ActionGroup>
}
