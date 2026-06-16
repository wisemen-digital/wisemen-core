import { NodePlopAPI } from 'plop'
import { Builder } from '#src/builder/builder.js'
import { JobOptions } from '#src/type.js'
import { addJob, getQueueNames } from '#src/generators/jobs/job.generator.js'

export function setJobGenerator (plop: NodePlopAPI) {
  plop.setGenerator('job', {
    description: 'Generate job',
    prompts: [
      {
        type: 'input',
        name: 'dir',
        message: 'App directory:',
        default: 'src/app/'
      },
      {
        type: 'input',
        name: 'subdir',
        message: 'Subdirectory:'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Job name:'
      },
      {
        type: 'list',
        name: 'queue',
        message: 'Queue name:',
        choices: () => {
          return getQueueNames()
        }
      }
    ],
    actions: (answers: JobOptions) => {
      const builder = new Builder()

      addJob(builder, answers)

      return builder.build()
    }
  })
}
