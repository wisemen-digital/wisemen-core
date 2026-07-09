import { LocalizedStringItemDto } from '#src/localized-string.dto.js'

export class LocalizedStringItemDtoBuilder {
  private dto: LocalizedStringItemDto

  constructor () {
    this.dto = new LocalizedStringItemDto()
  }

  withLocale (locale: string): this {
    this.dto.locale = locale
    return this
  }

  withValue (value: string): this {
    this.dto.value = value
    return this
  }

  build (): LocalizedStringItemDto {
    return this.dto
  }
}
