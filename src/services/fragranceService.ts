import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { type MyVote, TableService } from './TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type ApiServiceContext } from './ApiService'
import { FragranceImagesRepo } from './repositories/FragranceImageRepo'
import { FragranceTraitsRepo } from './repositories/FragranceTraitsRepo'
import { FragranceAccordsRepo } from './repositories/FragranceAccordsRepo'
import { FragranceNotesRepo } from './repositories/FragranceNotesRepo'
import { FragranceReviewsRepo } from './repositories/FragranceReviewsRepo'
import { FragranceCollectionRepo } from './repositories/FragranceCollectionRepo'

export type FragranceRow = Selectable<DB['fragrances']> & MyVote

export class FragranceService extends TableService<'fragrances', FragranceRow> {
  images: FragranceImagesRepo
  traits: FragranceTraitsRepo
  accords: FragranceAccordsRepo
  notes: FragranceNotesRepo
  reviews: FragranceReviewsRepo
  collections: FragranceCollectionRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragrances')

    this.images = new FragranceImagesRepo(sources)
    this.traits = new FragranceTraitsRepo(sources)
    this.accords = new FragranceAccordsRepo(sources)
    this.notes = new FragranceNotesRepo(sources)
    this.reviews = new FragranceReviewsRepo(sources)
    this.collections = new FragranceCollectionRepo(sources)

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        return sources
          .db
          .selectFrom('fragrances')
          .leftJoin('fragranceVotes as fv', join =>
            join
              .onRef('fv.fragranceId', '=', 'fragrances.id')
              .on('fv.userId', '=', userId)
              .on('fv.deletedAt', 'is', null)
          )
          .selectAll('fragrances')
          .select('fv.vote as myVote')
      })
  }

  setContext (context: ApiServiceContext): this {
    super
      .setContext(context)

    this
      .images
      .setContext(context)

    this
      .traits
      .setContext(context)

    this
      .accords
      .setContext(context)

    this
      .notes
      .setContext(context)

    this
      .reviews
      .setContext(context)

    return this
  }
}
