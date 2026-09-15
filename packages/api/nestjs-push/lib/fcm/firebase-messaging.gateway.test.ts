import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { deleteApp, getApps, initializeApp } from 'firebase-admin/app'
import { FirebaseMessagingGateway } from './firebase-messaging.gateway.js'

function gatewayFor (appName: string, projectId = 'test-project'): FirebaseMessagingGateway {
  return new FirebaseMessagingGateway({ appName, projectId })
}

/** Trigger lazy initialization without sending a message. */
function resolveApp (gateway: FirebaseMessagingGateway): void {
  ;(gateway as unknown as { getApp: () => unknown }).getApp()
}

describe('FirebaseMessagingGateway app lifecycle', () => {
  const created: string[] = []

  before(() => {
    // initializeApp reads this path but does not load credentials until a send.
    process.env.GOOGLE_APPLICATION_CREDENTIALS ??= '/nonexistent/service-account.json'
  })

  after(async () => {
    for (const name of created) {
      const app = getApps().find(candidate => candidate.name === name)

      if (app !== undefined) await deleteApp(app)
    }
  })

  it('creates a named app lazily and never before it is needed', () => {
    const appName = `lazy-${Date.now()}`
    created.push(appName)
    const gateway = gatewayFor(appName)

    expect(getApps().some(app => app.name === appName)).toBe(false)

    resolveApp(gateway)

    expect(getApps().some(app => app.name === appName)).toBe(true)
  })

  it('deletes the app it created on module destroy', async () => {
    const appName = `owned-${Date.now()}`
    created.push(appName)
    const gateway = gatewayFor(appName)
    resolveApp(gateway)
    expect(getApps().some(app => app.name === appName)).toBe(true)

    await gateway.onModuleDestroy()

    expect(getApps().some(app => app.name === appName)).toBe(false)
  })

  it('leaves an app it merely reused alone on module destroy', async () => {
    const appName = `reused-${Date.now()}`
    created.push(appName)
    initializeApp({ projectId: 'test-project' }, appName)

    const gateway = gatewayFor(appName)
    resolveApp(gateway)
    await gateway.onModuleDestroy()

    expect(getApps().some(app => app.name === appName)).toBe(true)
  })

  it('is safe to destroy twice', async () => {
    const appName = `twice-${Date.now()}`
    created.push(appName)
    const gateway = gatewayFor(appName)
    resolveApp(gateway)

    await gateway.onModuleDestroy()
    await gateway.onModuleDestroy()

    expect(getApps().some(app => app.name === appName)).toBe(false)
  })

  it('rejects a blank project id when the app has to be created', () => {
    const gateway = gatewayFor(`blank-${Date.now()}`, '   ')

    expect(() => { resolveApp(gateway) }).toThrow('non-empty projectId')
  })
})
