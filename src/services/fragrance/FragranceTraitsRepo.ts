import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { type MyVote, TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export type FragranceTraitRow = Selectable<DB['fragranceTraits']> & MyVote

export class FragranceTraitsRepo extends TableService<'fragranceTraits', FragranceTraitRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceTraits')

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        return sources
          .db
          .selectFrom('fragranceTraits')
          .leftJoin('fragrances', 'fragrances.id', 'fragranceTraits.fragranceId')
          .leftJoin('fragranceTraitVotes as tv', join =>
            join
              .onRef('tv.fragranceTraitId', '=', 'fragranceTraits.id')
              .on('tv.userId', '=', userId)
              .on('tv.deletedAt', 'is', null)
          )
          .selectAll('fragranceTraits')
          .select('tv.vote as myVote')
      })
  }
}
