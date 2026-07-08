import { getSettingsContact } from './queries/getSettingsContact.query.ts'
import { getSettingsFooter } from './queries/getSettingsFooter.query.ts'
import { getSettingsGeneral } from './queries/getSettingsGeneral.query.ts'
import { getSettingsHeader } from './queries/getSettingsHeader.query.ts'
import { getSettingsHomepage } from './queries/getSettingsHomepage.query.ts'
import { getSettingsSocials } from './queries/getSettingsSocials.query.ts'

export {
  getSettingsContact,
  getSettingsFooter,
  getSettingsGeneral,
  getSettingsHeader,
  getSettingsHomepage,
  getSettingsSocials,
}

export function getSettingsQueries() {
  return {
    getSettingsContact,
    getSettingsFooter,
    getSettingsGeneral,
    getSettingsHeader,
    getSettingsHomepage,
    getSettingsSocials,
  }
}
