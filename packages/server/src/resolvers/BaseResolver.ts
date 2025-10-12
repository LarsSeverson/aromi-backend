import { BackendError, type UserRow } from '@aromi/shared'
import type { ServerContext } from '@src/context/index.js'
import { CursorFactory } from '@src/factories/CursorFactory.js'
import { PageFactory } from '@src/factories/PageFactory.js'
import { SearchPageFactory } from '@src/features/search/factories/SearchPageFactory.js'
import { SearchPaginationFactory } from '@src/features/search/factories/SearchPaginationFactory.js'

export abstract class BaseResolver<T> {
  protected readonly pageFactory = new PageFactory()
  protected readonly searchPageFactory = new SearchPageFactory()
  protected readonly cursorFactory = new CursorFactory()

  protected readonly searchPagination = new SearchPaginationFactory()

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
