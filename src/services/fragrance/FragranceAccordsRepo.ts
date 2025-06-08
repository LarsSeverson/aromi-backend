import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { type MyVote, TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export interface FragranceAccordRow extends Selectable<DB['fragranceAccords']>, MyVote {
  accordId: number
  name: string
  color: string
}

export class FragranceAccordsRepo extends TableService<'fragranceAccords', FragranceAccordRow> {
  fillers: FragranceAccordFillerRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceAccords')

    this.fillers = new FragranceAccordFillerRepo(sources)

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        return sources
          .db
          .selectFrom('fragranceAccords')
          .innerJoin('accords', 'accords.id', 'fragranceAccords.accordId')
          .leftJoin('fragrances', 'fragrances.id', 'fragranceAccords.fragranceId')
          .leftJoin('fragranceAccordVotes as av', join =>
            join
              .onRef('av.fragranceAccordId', '=', 'fragranceAccords.id')
              .on('av.userId', '=', userId)
              .on('av.deletedAt', 'is', null)
          )
          .selectAll('fragranceAccords')
          .select([
            'av.vote as myVote',
            'accords.id as accordId',
            'accords.name',
            'accords.color'
          ])
      })
  }
}

export type FragranceAccordFillerRow = Selectable<DB['accords']>

export class FragranceAccordFillerRepo extends TableService<'accords', FragranceAccordFillerRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'accords')
  }
}
