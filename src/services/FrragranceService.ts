import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { type MyVote, TableService } from './TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type ApiServiceContext } from './apiService'
import { FragranceImagesRepo } from './fragrance/FragranceImageRepo'
import { FragranceTraitsRepo } from './fragrance/FragranceTraitsRepo'
import { FragranceAccordsRepo } from './fragrance/FragranceAccordsRepo'
import { FragranceNotesRepo } from './fragrance/FragranceNotesRepo'
import { FragranceReviewsRepo } from './fragrance/FragranceReviewsRepo'

export type FragranceRow = Selectable<DB['fragrances']> & MyVote

export class FragranceService extends TableService<'fragrances', FragranceRow> {
  images: FragranceImagesRepo
  traits: FragranceTraitsRepo
  accords: FragranceAccordsRepo
  notes: FragranceNotesRepo
  reviews: FragranceReviewsRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragrances')

    this.images = new FragranceImagesRepo(sources)
    this.traits = new FragranceTraitsRepo(sources)
    this.accords = new FragranceAccordsRepo(sources)
    this.notes = new FragranceNotesRepo(sources)
    this.reviews = new FragranceReviewsRepo(sources)

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
