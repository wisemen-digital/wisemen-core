import { NodePlopAPI } from 'plop'
import { setModuleGenerator } from './plop-generators/module.generator.js'
import { setTranslationGenerator } from './plop-generators/translation.generator.js'
import { setBuilderGenerator } from './plop-generators/builder.generator.js'
import { setTypesenseGenerator } from './plop-generators/typesense.generator.js'
import { setCronjobGenerator } from './plop-generators/cronjob.generator.js'
import { setJobGenerator } from './plop-generators/job.generator.js'

export default function (plop: NodePlopAPI) {
  setModuleGenerator(plop)
  setTypesenseGenerator(plop)
  setBuilderGenerator(plop)
  setCronjobGenerator(plop)
  setJobGenerator(plop)
  setTranslationGenerator(plop)
}
