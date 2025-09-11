import type { ServerContext } from '@src/context/index.js'
import { RequestResolver, type RequestResolverParams } from './RequestResolver.js'
import { BackendError } from '@aromi/shared'

export abstract class AuthenticatedRequestResolver<TResolver> extends RequestResolver<TResolver> {
  protected me!: NonNullable<ServerContext['me']>

  constructor (
    params: RequestResolverParams<TResolver>,
    onUnauthenticatedMessage?: string
  ) {
    super(params)
    this.checkAuthenticated(onUnauthenticatedMessage)
  }

  protected checkAuthenticated (
    mesage?: string
  ): void {
    if (this.context.me == null) {
      throw new BackendError(
        'NOT_AUTHENTICATED',
        mesage ?? 'Please log in or sign up before continuing',
        401
      )
    }

    this.me = this.context.me
  }
}
