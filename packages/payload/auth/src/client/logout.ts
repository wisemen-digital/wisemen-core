import { removeAuthCookie } from '#shared/authData.ts'

export function logout(): void {
  removeAuthCookie()
}
