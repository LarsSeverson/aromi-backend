import { ApiError } from '@src/common/error'
import { type DB, type FragranceImage } from '@src/db/schema'
import { ResultAsync } from 'neverthrow'
import { DBService, type ServiceFindCriteria } from '../DBService'
import { type Selectable } from 'kysely'
import { type UpdateObjectExpression } from 'kysely/dist/cjs/parser/update-set-parser'

export type FragranceImageRow = Selectable<FragranceImage>

export class FragranceImageRepo extends DBService<'fragranceImages'> {
  create (
    data: Pick<FragranceImageRow, 'fragranceId' | 's3Key'>
  ): ResultAsync<FragranceImageRow, ApiError> {
    const { db } = this
    const { fragranceId, s3Key } = data

    return ResultAsync
      .fromPromise(
        db
          .insertInto('fragranceImages')
          .values({ fragranceId, s3Key, status: 'uploaded' })
          .returningAll()
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  update (
    criteria: ServiceFindCriteria<'fragranceImages'>,
    changes: UpdateObjectExpression<DB, 'fragranceImages', 'fragranceImages'>
  ): ResultAsync<FragranceImageRow, ApiError> {
    const { db } = this

    const base = db
      .updateTable('fragranceImages')
      .set(changes)
      .returningAll()

    return ResultAsync
      .fromPromise(
        this
          .entries(criteria)
          .reduce(
            (qb, [column, value]) => qb
              .where(`fragranceImages.${column}`, this.operand(value), value),
            base
          )
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  delete (
    id: number
  ): ResultAsync<FragranceImageRow, ApiError> {
    const { db } = this

    return ResultAsync
      .fromPromise(
        db
          .deleteFrom('fragranceImages')
          .where('id', '=', id)
          .returningAll()
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }
}
