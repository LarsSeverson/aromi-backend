import { type DB } from '@src/db/schema'
import { sql, type Selectable } from 'kysely'
import { type MyVote, TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { INVALID_ID } from '@src/common/types'

export interface FragranceAccordRow extends Selectable<DB['fragranceAccords']>, MyVote {
  accordId: number
  name: string
  color: string
  isFill: boolean
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
            'accords.color',
            sql<boolean>`FALSE`.as('isFill')
          ])
      })
  }
}

export class FragranceAccordFillerRepo extends TableService<'fragranceAccords', FragranceAccordRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceAccords')

    this
      .Table
      .setAlias('fillerAccords')
      .setBaseQueryFactory(() => {
        const subquery = sources
          .db
          .selectFrom('accords')
          .selectAll('accords')
          .select([
            'accords.id as accordId',
            sql<number>`${INVALID_ID}`.as('fragranceId'),
            sql<number>`0`.as('dislikesCount'),
            sql<number>`0`.as('likesCount'),
            sql<number>`0`.as('voteScore'),
            sql<number>`0`.as('myVote'),
            sql<boolean>`TRUE`.as('isFill')
          ])
          .as('fillerAccords')

        return sources
          .db
          .selectFrom(subquery)
          .selectAll()
      })
  }
}
