import { PassThrough, Writable } from 'stream'

export function createUploadWritable ( upload: (stream: PassThrough) => Promise<void>): Writable {
  const passThrough = new PassThrough()

  const writable = new Writable({
    write (chunk, encoding, callback) {
      if (passThrough.write(chunk, encoding)) {
        callback()
        return
      }

      passThrough.once('drain', callback)
    },
    final (callback) {
      passThrough.end()

      void uploadPromise.then(
        () => callback(),
        error => callback(error)
      )
    },
    destroy (error, callback) {
      passThrough.destroy(error ?? undefined)
      callback(error ?? null)
    }
  })

  passThrough.on('error', error => {
    if (!writable.destroyed) {
      writable.destroy(error)
    }
  })

  const uploadPromise = upload(passThrough)

  void uploadPromise.catch(error => {
    if (!writable.destroyed) {
      writable.destroy(error)
    }
  })

  return writable
}
