import type { BackendError } from '@aromi/shared'
import type { ServerContext } from '@src/context/index.js'
import type { ResolverFnOf } from '@src/utils/types.js'
import type { ResultAsync, Result } from 'neverthrow'

export type ResolverArgs<T> = Parameters<ResolverFnOf<T>>
export type Parent<T> = ResolverArgs<T>[0]
export type Args<T> = ResolverArgs<T>[1]
export type Context<T> = ResolverArgs<T>[2]
export type Info<T> = ResolverArgs<T>[3]

export type ResolverReturn<T> = Awaited<ReturnType<ResolverFnOf<T>>>
export type WrappedReturn<T> =
  | Result<T, BackendError>
  | ResultAsync<T, BackendError>

export interface RequestResolverParams<
  TResolver,
  TArgs = Args<TResolver>,
  TParent = Parent<TResolver>,
  TInfo = Info<TResolver>
> {
  parent: TParent
  args: TArgs
  context: ServerContext
  info: TInfo
}

export abstract class RequestResolver<
  TResolver,
  TArgs = Args<TResolver>,
  TParent = Parent<TResolver>,
  TInfo = Info<TResolver>,
  TResult = ResolverReturn<TResolver>
> {
  protected readonly parent: TParent
  protected readonly args: TArgs
  protected readonly context: ServerContext
  protected readonly info: TInfo

  constructor (
    params: RequestResolverParams<TResolver, TArgs, TParent, TInfo>
  ) {
    const { parent, args, context, info } = params
    this.parent = parent
    this.args = args
    this.context = context
    this.info = info
  }

  abstract resolve (): WrappedReturn<TResult>
}