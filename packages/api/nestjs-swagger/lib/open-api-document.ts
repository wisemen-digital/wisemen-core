import type { OpenAPIObject } from '@nestjs/swagger'

export type OpenApiDocument = Omit<OpenAPIObject, 'paths'>
