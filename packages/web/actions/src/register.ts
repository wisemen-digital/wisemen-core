import type { ActionContext } from '#types/actionContext.type'

export interface Register {}

export type RegisteredActionContext = Register extends { actionContext: infer T } ? T : ActionContext
