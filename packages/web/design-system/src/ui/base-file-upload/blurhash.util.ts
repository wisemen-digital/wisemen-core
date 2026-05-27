import { encode } from 'blurhash'

export class BlurhashUtil {
  static async encode(file: File): Promise<string | null> {
    const isImage = file.type.startsWith('image/')

    if (!isImage) {
      return null
    }

    const image = await this.loadImage(URL.createObjectURL(file))
    const clampedSize = this.getClampedSize(image.width, image.height, 32)
    const imageData = this.getImageData(image, clampedSize.width, clampedSize.height)

    try {
      return encode(imageData.data, imageData.width, imageData.height, 4, 4)
    }
    catch {
      return null
    }
  }

  private static getClampedSize(
    width: number,
    height: number,
    max: number,
  ): {
    height: number
    width: number
  } {
    if (width >= height && width > max) {
      return {
        height: Math.round((height / width) * max),
        width: max,
      }
    }

    if (height > width && height > max) {
      return {
        height: max,
        width: Math.round((width / height) * max),
      }
    }

    return {
      height,
      width,
    }
  }

  private static getImageData(image: HTMLImageElement, resolutionX: number, resolutionY: number): ImageData {
    const canvas = document.createElement('canvas')

    canvas.width = resolutionX
    canvas.height = resolutionY

    const context = canvas.getContext('2d')!

    context.drawImage(image, 0, 0, resolutionX, resolutionY)

    return context.getImageData(0, 0, resolutionX, resolutionY)
  }

  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.addEventListener('load', () => resolve(img))
      img.addEventListener('error', (...args) => reject(args))
      img.src = src
    })
  }
}
