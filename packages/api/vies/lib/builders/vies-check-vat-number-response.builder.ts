import { CountryCode } from '../enums/country-code.enum.js'
import { ViesCheckVatNumberResponse } from '../responses/check-vat-number.response.js'

export class ViesCheckVatNumberResponseBuilder {
  private response: ViesCheckVatNumberResponse

  constructor () {
    this.reset()
  }

  private reset (): this {
    this.response = {
      countryCode: CountryCode.BELGIUM,
      vatNumber: '123123123',
      requestDate: '2025-07-29T13:15:20.785Z',
      valid: false,
      requestIdentifier: '',
      name: '---',
      address: '---',
      traderName: '---',
      traderStreet: '---',
      traderPostalCode: '---',
      traderCity: '---',
      traderCompanyType: '---',
      traderNameMatch: 'NOT_PROCESSED',
      traderStreetMatch: 'NOT_PROCESSED',
      traderPostalCodeMatch: 'NOT_PROCESSED',
      traderCityMatch: 'NOT_PROCESSED',
      traderCompanyTypeMatch: 'NOT_PROCESSED'
    }

    return this
  }

  withCountryCode (countryCode: CountryCode): this {
    this.response.countryCode = countryCode

    return this
  }

  withVatNumber (vatNumber: string): this {
    this.response.vatNumber = vatNumber

    return this
  }

  withRequestDate (requestDate: string): this {
    this.response.requestDate = requestDate

    return this
  }

  withValid (valid: boolean): this {
    this.response.valid = valid

    return this
  }

  withRequestIdentifier (requestIdentifier: string): this {
    this.response.requestIdentifier = requestIdentifier

    return this
  }

  withName (name: string): this {
    this.response.name = name

    return this
  }

  withAddress (address: string): this {
    this.response.address = address

    return this
  }

  withTraderName (traderName: string): this {
    this.response.traderName = traderName

    return this
  }

  withTraderStreet (traderStreet: string): this {
    this.response.traderStreet = traderStreet

    return this
  }

  withTraderPostalCode (traderPostalCode: string): this {
    this.response.traderPostalCode = traderPostalCode

    return this
  }

  withTraderCity (traderCity: string): this {
    this.response.traderCity = traderCity

    return this
  }

  withTraderCompanyType (traderCompanyType: string): this {
    this.response.traderCompanyType = traderCompanyType

    return this
  }

  withTraderNameMatch (traderNameMatch: string): this {
    this.response.traderNameMatch = traderNameMatch

    return this
  }

  withTraderStreetMatch (traderStreetMatch: string): this {
    this.response.traderStreetMatch = traderStreetMatch

    return this
  }

  withTraderPostalCodeMatch (traderPostalCodeMatch: string): this {
    this.response.traderPostalCodeMatch = traderPostalCodeMatch

    return this
  }

  withTraderCityMatch (traderCityMatch: string): this {
    this.response.traderCityMatch = traderCityMatch

    return this
  }

  withTraderCompanyTypeMatch (traderCompanyTypeMatch: string): this {
    this.response.traderCompanyTypeMatch = traderCompanyTypeMatch

    return this
  }

  public build (): ViesCheckVatNumberResponse {
    const result = this.response

    this.reset()

    return result
  }
}
