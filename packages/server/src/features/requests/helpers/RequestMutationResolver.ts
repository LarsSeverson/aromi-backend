import { BackendError, RequestStatus, type SomeRequestRow } from '@aromi/shared'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { Args, Info, Parent, ResolverReturn } from '@src/resolvers/RequestResolver.js'
import { errAsync, okAsync } from 'neverthrow'

export abstract class RequestMutationResolver<
  TResolver,
  TArgs = Args<TResolver>,
  TParent = Parent<TResolver>,
  TInfo = Info<TResolver>,
  TResult = ResolverReturn<TResolver>
> extends MutationResolver<TResolver, TArgs, TParent, TInfo, TResult> {
  protected authorizeEdit <R extends SomeRequestRow>(request: R) {
    if (!this.isUserAuthorized(request)) {
      return errAsync(
        new BackendError(
          'NOT_AUTHORIZED',
          'You are not authorized to perform this action',
          403
        )
      )
    }

    if (!this.isRequestEditable(request)) {
      return errAsync(
        new BackendError(
          'NOT_EDITABLE',
          'This request is not editable',
          400
        )
      )
    }

    return okAsync(request)
  }

  protected isRequestEditable (request: SomeRequestRow) {
    return ![RequestStatus.ACCEPTED, RequestStatus.DENIED].includes(request.requestStatus)
  }

  protected isUserAuthorized (request: SomeRequestRow) {
    return request.userId === this.me.id
  }
}