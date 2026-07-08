import { useI18n } from 'vue-i18n'

import type { ActionGroup } from '#types/actionGroup.type'

export enum GroupPriority {
  HOVER = 1,
  VIEW = 2,
  MODEL = 3,
  GENERAL = 4,
  NAVIGATION = 5,
  PREFERENCES = 6,
  SETTINGS = 7,
  APPLICATION = 8,
  ACCOUNT = 9,
  DEVELOPER = 10,
}

export function useActionGroup() {
  const i18n = useI18n()

  return {
    account: {
      name: i18n.t('action.group.account'),
      priority: GroupPriority.ACCOUNT,
    },
    application: {
      name: i18n.t('action.group.application'),
      priority: GroupPriority.APPLICATION,
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
    settings: {
      name: i18n.t('action.group.settings'),
      priority: GroupPriority.SETTINGS,
    },
  } satisfies Record<string, ActionGroup>
}
