import { ApiError } from '@src/common/error'
import { type ApiContext } from '@src/context'
import { CursorFactory } from '@src/factories/CursorFactory'
import { PageFactory } from '@src/factories/PageFactory'
import { type UserRow } from '@src/features/users/types'

export abstract class BaseResolver<T> {
  protected readonly pageFactory = new PageFactory()
  protected readonly cursorFactory = new CursorFactory()

  abstract getResolvers (): T

  protected checkAuthenticated (
    context: ApiContext,
    message?: string
  ): UserRow {
    if (context.me == null) {
      throw new ApiError(
        'NOT_AUTHENTICATED',
        message ?? 'Please log in or sign up before continuing',
        401
      )
    }

    return context.me
  }
}
