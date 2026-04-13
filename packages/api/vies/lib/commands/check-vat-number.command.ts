import { CountryCode } from '../enums/country-code.enum.js'

export interface ViesCheckVatNumberCommand {
  countryCode: CountryCode
  vatNumber: string
  requesterMemberStateCode?: string
  requesterNumber?: string
  traderName?: string
  traderStreet?: string
  traderPostalCode?: string
  traderCity?: string
  traderCompanyType?: string
}
