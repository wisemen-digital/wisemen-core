import type { Locator } from '@playwright/test'

export class MapTestUtil {
  private mapCanvasLocator: Locator

  constructor(mapCanvasLocator: Locator) {
    this.mapCanvasLocator = mapCanvasLocator
  }

  async drawPolygon(): Promise<void> {
    await this.mapCanvasLocator.click({
      position: {
        x: 100,
        y: 100,
      },
    })
    await this.mapCanvasLocator.click({
      position: {
        x: 200,
        y: 100,
      },
    })
    await this.mapCanvasLocator.click({
      position: {
        x: 200,
        y: 200,
      },
    })
    await this.mapCanvasLocator.click({
      position: {
        x: 100,
        y: 200,
      },
    })
    await this.mapCanvasLocator.click({
      position: {
        x: 100,
        y: 100,
      },
    })
  }
}
