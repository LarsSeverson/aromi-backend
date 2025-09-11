import type { BackendError } from '@aromi/shared'
import type { ServerContext } from '@src/context/index.js'
import type { ResolverFnOf } from '@src/utils/types.js'
import type { ResultAsync, Result } from 'neverthrow'

export type ResolverArgs<T> = Parameters<ResolverFnOf<T>>
export type Parent<T> = ResolverArgs<T>[0]
export type Args<T> = ResolverArgs<T>[1]
export type Context<T> = ResolverArgs<T>[2]
export type Info<T> = ResolverArgs<T>[3]

export type ResolverReturnType<T> = Awaited<ReturnType<ResolverFnOf<T>>>

export interface RequestResolverParams<T> {
  parent: Parent<T>
  args: Args<T>
  context: ServerContext
  info: Info<T>
}

export abstract class RequestResolver<TResolver> {
  protected readonly parent: Parent<TResolver>
  protected readonly args: Args<TResolver>
  protected readonly context: ServerContext
  protected readonly info: Info<TResolver>

  constructor (params: RequestResolverParams<TResolver>) {
    const { parent, args, context, info } = params
    this.parent = parent
    this.args = args
    this.context = context
    this.info = info
  }

  abstract resolve ():
    | Result<ResolverReturnType<TResolver>, BackendError>
    | ResultAsync<ResolverReturnType<TResolver>, BackendError>
}