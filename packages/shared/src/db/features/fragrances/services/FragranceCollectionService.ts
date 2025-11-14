import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import { PREVIEW_ITEMS_LIMIT, type FragranceCollectionRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { FragranceCollectionItemService } from './FragranceCollectionItemService.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'

export class FragranceCollectionService extends FeaturedTableService<FragranceCollectionRow> {
  items: FragranceCollectionItemService

  constructor (sources: DataSources) {
    super(sources, 'fragranceCollections')
    this.items = new FragranceCollectionItemService(sources)
  }

  findPreviewItems (
    where?: ExpressionOrFactory<DB, 'fragranceCollections', SqlBool>
  ) {
    const db = this.db

    let query = db
      .selectFrom('fragranceCollections')
      .innerJoinLateral(
        eb => eb
          .selectFrom('fragranceCollectionItems')
          .selectAll('fragranceCollectionItems')
          .whereRef('fragranceCollectionItems.collectionId', '=', 'fragranceCollections.id')
          .where('fragranceCollectionItems.deletedAt', 'is', null)
          .orderBy('fragranceCollectionItems.rank', 'desc')
          .limit(PREVIEW_ITEMS_LIMIT)
          .as('i'),
        join => join.onTrue()
      )
      .selectAll('i')
      .where('fragranceCollections.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }

  hasFragranceInCollections (
    collectionIds: string[],
    fragranceId: string
  ) {
    const db = this.db

    const query = db
      .selectFrom('fragranceCollectionItems')
      .select('collectionId')
      .where('fragranceId', '=', fragranceId)
      .where('deletedAt', 'is', null)
      .where('collectionId', 'in', collectionIds)
      .groupBy('collectionId')

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }
}