import type { Page } from '@playwright/test'

export async function setupWebSocketMock(page: Page, urlPattern: string = 'wss://*/websockets*'): Promise<void> {
  await page.routeWebSocket(urlPattern, (ws) => {
    ws.onMessage((message) => {
      if (message === 'request') {
        ws.send('response')
      }
    })
  })
}
