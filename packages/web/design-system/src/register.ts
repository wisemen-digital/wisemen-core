import type { ActionContext } from '@wisemen/vue-core-actions'
import type {
  RouteLocationRaw,
  Router,
} from 'vue-router'

export interface Register {}

type RegisteredRouter = Register extends { router: infer R } ? R : Router

export type RegisteredRouteLocationRaw = RegisteredRouter extends {
  push: (to: infer R, ...args: any[]) => any
} ? R : RouteLocationRaw

export type RegisteredActionContext = Register extends { actionContext: infer T } ? T : ActionContext
