import type { BackendError } from '@aromi/shared'
import type { ResultAsync, Result } from 'neverthrow'

export type ResolverFnOf<T> =
  T extends (...args: infer P) => infer R
    ? (...args: P) => R
    : T extends { resolve: (...args: infer P) => infer R }
      ? (...args: P) => R
      : never

export type ResolverWithReturn<TAllowed, TResolver> =
  Awaited<ReturnType<ResolverFnOf<TResolver>>> extends TAllowed
    ? TResolver
    : never

export type ResolverArgs<T> = Parameters<ResolverFnOf<T>>
export type Parent<T> = ResolverArgs<T>[0]
export type Args<T> = ResolverArgs<T>[1]
export type Context<T> = ResolverArgs<T>[2]
export type Info<T> = ResolverArgs<T>[3]

export type ResolverReturn<T> = Awaited<ReturnType<ResolverFnOf<T>>>

export type WrappedReturn<T> =
  | Result<T, BackendError>
  | ResultAsync<T, BackendError>
