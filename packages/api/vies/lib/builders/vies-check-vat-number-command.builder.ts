import { ViesCheckVatNumberCommand } from '../commands/check-vat-number.command.js'
import { CountryCode } from '../enums/country-code.enum.js'

export class ViesCheckVatNumberCommandBuilder {
  private command: ViesCheckVatNumberCommand

  constructor () {
    this.reset()
  }

  private reset (): this {
    this.command = {
      countryCode: CountryCode.BELGIUM,
      vatNumber: '12313311'
    }

    return this
  }

  withCountryCode (countryCode: CountryCode): this {
    this.command.countryCode = countryCode

    return this
  }

  withVatNumber (vatNumber: string): this {
    this.command.vatNumber = vatNumber

    return this
  }

  withRequesterMemberStateCode (requesterMemberStateCode?: string): this {
    this.command.requesterMemberStateCode = requesterMemberStateCode

    return this
  }

  withRequesterNumber (requesterNumber?: string): this {
    this.command.requesterNumber = requesterNumber

    return this
  }

  withTraderName (traderName?: string): this {
    this.command.traderName = traderName

    return this
  }

  withTraderStreet (traderStreet?: string): this {
    this.command.traderStreet = traderStreet

    return this
  }

  withTraderPostalCode (traderPostalCode?: string): this {
    this.command.traderPostalCode = traderPostalCode

    return this
  }

  withTraderCity (traderCity?: string): this {
    this.command.traderCity = traderCity

    return this
  }

  withTraderCompanyType (traderCompanyType?: string): this {
    this.command.traderCompanyType = traderCompanyType

    return this
  }

  public build (): ViesCheckVatNumberCommand {
    const result = this.command

    this.reset()

    return result
  }
}
