import { useI18n } from 'vue-i18n'
import type { ActionGroup } from '../types/actionGroup.type'

enum GroupPriority {
  MODEL = 1,
  GENERAL = 2,
  NAVIGATION = 3,
  PREFERENCES = 4,
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
