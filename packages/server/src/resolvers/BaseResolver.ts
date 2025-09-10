import { BackendError, type UserRow } from '@aromi/shared'
import type { ServerContext } from '@src/context/index.js'
import { CursorFactory } from '@src/factories/CursorFactory.js'
import { PageFactory } from '@src/factories/PageFactory.js'

export abstract class BaseResolver<T> {
  protected readonly pageFactory = new PageFactory()
  protected readonly cursorFactory = new CursorFactory()

  abstract getResolvers (): T

  protected checkAuthenticated (
    context: ServerContext,
    message?: string
  ): UserRow {
    if (context.me == null) {
      throw new BackendError(
        'NOT_AUTHENTICATED',
        message ?? 'Please log in or sign up before continuing',
        401
      )
    }

    return context.me
  }
}
