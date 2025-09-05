import { ApiError } from '@src/utils/error'
import { type ServerContext } from '@src/server/context'
import { CursorFactory } from '@src/server/factories/CursorFactory'
import { PageFactory } from '@src/server/factories/PageFactory'
import { type UserRow } from '@src/db/features/users/types'

export abstract class BaseResolver<T> {
  protected readonly pageFactory = new PageFactory()
  protected readonly cursorFactory = new CursorFactory()

  abstract getResolvers (): T

  protected checkAuthenticated (
    context: ServerContext,
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
