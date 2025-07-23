import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { type MyVote, TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type ResultAsync } from 'neverthrow'
import { type ApiError } from '@src/common/error'
import { TraitVotesRepo } from './TraitVotesRepo'

export type FragranceTraitRow = Selectable<DB['fragranceTraits']> & MyVote

export class FragranceTraitsRepo extends TableService<'fragranceTraits', FragranceTraitRow> {
  votes: TraitVotesRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceTraits')

    this.votes = new TraitVotesRepo(sources)

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

  vote (
    params: TraitVoteParams
  ): ResultAsync<FragranceTraitRow, ApiError> {
    const { userId, traitId, vote } = params
    const updatedAt = new Date().toISOString()

    return this
      .findOne(
        eb => eb('fragranceTraits.id', '=', traitId)
      )
      .andThen(trait => this
        .votes
        .upsert(
          {
            userId,
            fragranceTraitId: traitId,
            vote
          },
          oc => oc
            .columns(['userId', 'fragranceTraitId'])
            .doUpdateSet(
              {
                vote,
                updatedAt
              }
            )
        )
        .map(() => trait)
      )
  }
}

export interface TraitVoteParams {
  userId: number
  traitId: number
  vote: number
}
