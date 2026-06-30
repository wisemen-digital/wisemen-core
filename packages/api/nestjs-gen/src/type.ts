/* eslint-disable @typescript-eslint/naming-convention */
export interface ModuleAnswers {
  dir: string
  subdir: string
  module: string
  modulePlural: string
  createEntity: boolean
  type: ('create' | 'detail' | 'index' | 'update' | 'delete' | 'custom')[]
  custom?: string
  custom_addons?: ('response' | 'command' | 'query' | 'domain_event')[]
  domain_event_name?: string
}

export interface BuilderAnswers {
  type: 'command' | 'entity' | 'query' | 'interface'
  inputPath: string
  outputPath: string
}

export interface GeneratorOptions {
  dir: string
  subdir: string
  module: string
  modulePlural: string
}

export interface TranslationOptions {
  type: 'permissions' | 'notifications' | 'eventLogs'
  languages: string[]
}

export interface EventOptions {
  name: string
  path: string
}

export interface ErrorOptions {
  notFoundErrorKey: string | null
}

export interface TypesenseOptions {
  dir: string
  subdir: string
  name: string
  includeSubscriber: boolean
}

export interface CronjobOptions {
  dir: string
  subdir: string
  name: string
}

export interface JobOptions {
  dir: string
  subdir: string
  name: string
  queue: string
}
