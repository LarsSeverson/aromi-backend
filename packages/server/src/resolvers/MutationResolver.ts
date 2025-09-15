import type { ServerContext } from '@src/context/index.js'
import { type Args, type Info, type Parent, RequestResolver, type RequestResolverParams, type ResolverReturn } from './RequestResolver.js'
import { BackendError } from '@aromi/shared'

export abstract class MutationResolver<
  TResolver,
  TArgs = Args<TResolver>,
  TParent = Parent<TResolver>,
  TInfo = Info<TResolver>,
  TResult = ResolverReturn<TResolver>
> extends RequestResolver<TResolver, TArgs, TParent, TInfo, TResult> {
  protected me!: NonNullable<ServerContext['me']>

  constructor (
    params: RequestResolverParams<TResolver, TArgs, TParent, TInfo>,
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
