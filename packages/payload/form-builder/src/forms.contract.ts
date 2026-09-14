import { oc } from '@orpc/contract'
import { z } from 'zod'

const submitForm = oc
  .route({
    method: 'POST',
  })
  .input(z.object({
    data: z.record(z.string(), z.unknown()),
    form: z.string().min(1),
  }))
  .output(z.object({
    status: z.literal('created'),
  }))

export const FORMS_CONTRACT = {
  submitForm,
}
