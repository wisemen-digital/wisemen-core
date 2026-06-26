type ErrInterceptor<Err, Res, Req, Options> = (
  error: Err,
  response: Res,
  request: Req,
  options: Options,
) => Err | Promise<Err>

type ReqInterceptor<Req, Options> = (request: Req, options: Options) => Req | Promise<Req>

type ResInterceptor<Res, Req, Options> = (
  response: Res,
  request: Req,
  options: Options,
) => Res | Promise<Res>

export interface Middleware<Req, Res, Err, Options> {
  error: Interceptors<ErrInterceptor<Err, Res, Req, Options>>
  request: Interceptors<ReqInterceptor<Req, Options>>
  response: Interceptors<ResInterceptor<Res, Req, Options>>
}

export class Interceptors<Interceptor> {
  fns: Array<Interceptor | null> = []

  clear(): void {
    this.fns = []
  }

  eject(id: number | Interceptor): void {
    const index = this._indexOf(id)
    if (this.fns[index]) this.fns[index] = null
  }

  exists(id: number | Interceptor): boolean {
    return Boolean(this.fns[this._indexOf(id)])
  }

  update(id: number | Interceptor, fn: Interceptor): number | Interceptor | false {
    const index = this._indexOf(id)
    if (this.fns[index]) { this.fns[index] = fn; return id }
    return false
  }

  use(fn: Interceptor): number {
    this.fns.push(fn)
    return this.fns.length - 1
  }

  private _indexOf(id: number | Interceptor): number {
    if (typeof id === 'number') return this.fns[id] ? id : -1
    return this.fns.indexOf(id)
  }
}

export const createInterceptors = <Req, Res, Err, Options>(): Middleware<Req, Res, Err, Options> => ({
  error: new Interceptors<ErrInterceptor<Err, Res, Req, Options>>(),
  request: new Interceptors<ReqInterceptor<Req, Options>>(),
  response: new Interceptors<ResInterceptor<Res, Req, Options>>(),
})
