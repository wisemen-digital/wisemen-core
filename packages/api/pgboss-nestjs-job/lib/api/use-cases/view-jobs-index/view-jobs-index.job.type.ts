import type { JobState } from '../../job-state.enum.js'

export interface ViewJobsIndexJob {
  queueName: string
  id: string
  name: string
  status: JobState
  createdAt: string
  completedAt: string | null
}
