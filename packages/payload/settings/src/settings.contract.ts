import { oc } from '@orpc/contract'

import {
  clientSettingsContactSchema,
  clientSettingsFooterSchema,
  clientSettingsGeneralSchema,
  clientSettingsHeaderSchema,
  clientSettingsHomePageSchema,
  clientSettingsSocialsSchema,
} from '#models/index.ts'

const getSettingsContact = oc
  .route({
    method: 'GET',
  })
  .output(clientSettingsContactSchema)

const getSettingsGeneral = oc
  .route({
    method: 'GET',
  })
  .output(clientSettingsGeneralSchema)

const getSettingsSocials = oc
  .route({
    method: 'GET',
  })
  .output(clientSettingsSocialsSchema)

const getSettingsHeader = oc
  .route({
    method: 'GET',
  })
  .output(clientSettingsHeaderSchema)

const getSettingsFooter = oc
  .route({
    method: 'GET',
  })
  .output(clientSettingsFooterSchema)

const getSettingsHomepage = oc
  .route({
    method: 'GET',
  })
  .output(clientSettingsHomePageSchema.nullable())

export function getSettingsContract() {
  return {
    getSettingsContact,
    getSettingsFooter,
    getSettingsGeneral,
    getSettingsHeader,
    getSettingsHomepage,
    getSettingsSocials,
  }
}
