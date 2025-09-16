import type { ServerContext } from '@src/context/index.js'
import type { Args, Info, Parent, ResolverReturn, WrappedReturn } from '@src/utils/types.js'

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