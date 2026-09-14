import type { JobState } from '../../job-state.enum.js'

export interface ViewJobDetailJob {
  id: string
  queueName: string
  priority: number
  name: string
  data: object | string | number | boolean | null
  status: JobState
  retryLimit: number
  retryCount: number
  retryDelay: number
  retryBackoff: boolean
  startAfter: string
  startedAt: string | null
  singletonKey: string | null
  singletonOn: string | null
  expireIn: object | string | number | boolean | null
  createdAt: string
  completedAt: string | null
  keepUntil: string
  output: object | string | number | boolean | null
  deadLetter: string | null
  policy: string | null
}
