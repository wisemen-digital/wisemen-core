import { NodePlopAPI } from 'plop'
import { Builder } from '#src/builder/builder.js'
import { CronjobOptions } from '#src/type.js'
import { addCronJob } from '#src/generators/cronjobs/cronjob.generator.js'

export function setCronjobGenerator (plop: NodePlopAPI) {
  plop.setGenerator('cronjob', {
    description: 'Generate cronjob',
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
        message: 'Cronjob name:'
      }
    ],
    actions: (answers: CronjobOptions) => {
      const builder = new Builder()

      addCronJob(builder, answers)

      return builder.build()
    }
  })
}
