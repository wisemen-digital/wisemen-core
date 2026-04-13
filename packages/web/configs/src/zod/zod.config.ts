import type { Composer } from 'vue-i18n'
import z from 'zod'

function configureZod(i18nInstance: Composer): void {
  z.config({
    customError: (iss) => {
      const {
        t,
      } = i18nInstance
      const isStringAndEmpty = iss.code === 'too_small' && iss.origin === 'string' && iss.minimum === 1
      const isInvalidType = iss.code === 'invalid_type'
      const isInvalidDiscriminator = iss.code === 'invalid_union'

      if (isStringAndEmpty || isInvalidType || isInvalidDiscriminator) {
        return t('package.configs.validation.required')
      }

      if (iss.code === 'invalid_format' && iss.format === 'email') {
        return t('package.configs.validation.invalid_email')
      }
      if (iss.code === 'invalid_format' && iss.format === 'url') {
        return t('package.configs.validation.invalid_url')
      }
      if (iss.code === 'invalid_format' && iss.format === 'date') {
        return t('package.configs.validation.invalid_date')
      }
      if (iss.code === 'invalid_format' && iss.format === 'time') {
        return t('package.configs.validation.invalid_time')
      }
      if (iss.code === 'invalid_format' && iss.format === 'datetime') {
        return t('package.configs.validation.invalid_datetime')
      }

      if (iss.code === 'too_big' && iss.origin === 'string') {
        return t('package.configs.validation.too_big_string', {
          count: iss.maximum,
        })
      }
      if (iss.code === 'too_big' && iss.origin === 'number') {
        return t('package.configs.validation.too_big_number', {
          count: iss.maximum,
        })
      }
      if (iss.code === 'too_big' && iss.origin === 'array') {
        return t('package.configs.validation.too_big_array', {
          count: iss.maximum,
        })
      }
      if (iss.code === 'too_big' && iss.origin === 'date') {
        return t('package.configs.validation.too_big_date', {
          count: iss.maximum,
        })
      }

      if (iss.code === 'too_small' && iss.origin === 'string') {
        return t('package.configs.validation.too_small_string', {
          count: iss.minimum,
        })
      }
      if (iss.code === 'too_small' && iss.origin === 'number') {
        return t('package.configs.validation.too_small_number', {
          count: iss.minimum,
        })
      }
      if (iss.code === 'too_small' && iss.origin === 'array') {
        return t('package.configs.validation.too_small_array', {
          count: iss.minimum,
        })
      }
      if (iss.code === 'too_small' && iss.origin === 'date') {
        return t('package.configs.validation.too_small_date', {
          count: iss.minimum,
        })
      }
    },
  })
}

export interface ZodConfigOptions {
  i18nInstance: Composer
}

export function zodConfig(options: ZodConfigOptions): void {
  configureZod(options.i18nInstance)
}
