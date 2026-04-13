import { CountryCode } from '../enums/country-code.enum.js'

export interface ViesHealthResponse {
  vow: {
    available: boolean
  }
  countries: [
    {
      countryCode: CountryCode.AUSTRIA
      availability: string
    },
    {
      countryCode: CountryCode.BELGIUM
      availability: string
    },
    {
      countryCode: CountryCode.BULGARIA
      availability: string
    },
    {
      countryCode: CountryCode.CYPRUS
      availability: string
    },
    {
      countryCode: CountryCode.CZECH_REPUBLIC
      availability: string
    },
    {
      countryCode: CountryCode.GERMANY
      availability: string
    },
    {
      countryCode: CountryCode.DENMARK
      availability: string
    },
    {
      countryCode: CountryCode.ESTONIA
      availability: string
    },
    {
      countryCode: CountryCode.GREECE
      availability: string
    },
    {
      countryCode: CountryCode.SPAIN
      availability: string
    },
    {
      countryCode: CountryCode.FINLAND
      availability: string
    },
    {
      countryCode: CountryCode.FRANCE
      availability: string
    },
    {
      countryCode: CountryCode.CROATIA
      availability: string
    },
    {
      countryCode: CountryCode.HUNGARY
      availability: string
    },
    {
      countryCode: CountryCode.IRELAND
      availability: string
    },
    {
      countryCode: CountryCode.ITALY
      availability: string
    },
    {
      countryCode: CountryCode.LITHUANIA
      availability: string
    },
    {
      countryCode: CountryCode.LUXEMBOURG
      availability: string
    },
    {
      countryCode: CountryCode.LATVIA
      availability: string
    },
    {
      countryCode: CountryCode.MALTA
      availability: string
    },
    {
      countryCode: CountryCode.NETHERLANDS
      availability: string
    },
    {
      countryCode: CountryCode.POLAND
      availability: string
    },
    {
      countryCode: CountryCode.PORTUGAL
      availability: string
    },
    {
      countryCode: CountryCode.ROMANIA
      availability: string
    },
    {
      countryCode: CountryCode.SWEDEN
      availability: string
    },
    {
      countryCode: CountryCode.SLOVENIA
      availability: string
    },
    {
      countryCode: CountryCode.SLOVAKIA
      availability: string
    },
    {
      countryCode: CountryCode.NORTHERN_IRELAND
      availability: string
    }
  ]
}
