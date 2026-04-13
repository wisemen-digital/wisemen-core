import assert from 'assert'
import { ConfigurableModuleBuilder, DynamicModule, Module } from '@nestjs/common'
import { Twilio } from './twilio.js'
import { TwilioOptions } from './twilio-options.js'

const {
  ConfigurableModuleClass,
  OPTIONS_TYPE: _OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: _ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<TwilioOptions>()
  .setClassMethodName('forRoot')
  .build()

@Module({
  providers: [Twilio],
  exports: [Twilio]
})
export class TwilioModule extends ConfigurableModuleClass {
  static override forRoot (options: typeof _OPTIONS_TYPE): DynamicModule {
    const module = super.forRoot(options)
    const providers = [...module.providers ?? []]

    providers.push({ provide: TwilioOptions, useValue: options })

    return { ...module, providers }
  }

  static override forRootAsync (options: typeof _ASYNC_OPTIONS_TYPE): DynamicModule {
    const module = super.forRootAsync(options)
    const providers = [...module.providers ?? []]

    assert(options.useFactory !== undefined)

    providers.push({
      provide: TwilioOptions,
      useFactory: options.useFactory,
      inject: options.inject
    })

    return { ...module, providers }
  }
}
