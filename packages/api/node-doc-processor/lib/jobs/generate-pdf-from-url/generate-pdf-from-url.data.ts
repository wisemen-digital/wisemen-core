/* oxlint-disable import-typescript/no-relative-parent-imports */
import { BaseJobData } from '@wisemen/pgboss-nestjs-job'
import { PageFormatEnum } from '../../types/enums/page-format.enum.js'
import { PageOrientationEnum } from '../../types/enums/page-orientation.enum.js'

 // oxlint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GeneratePdfFromUrlData<T extends BaseJobData = { }> extends BaseJobData {
  url: string
  s3Path: string

  data?: T
  callbackUrl?: string
  orientation?: PageOrientationEnum
  format?: PageFormatEnum
  queryParams?: Record<string, string>
}
