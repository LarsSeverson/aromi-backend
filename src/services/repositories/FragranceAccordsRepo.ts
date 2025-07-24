import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { type MyVote, TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { AccordVotesRepo } from './AccordVotesRepo'
import { AccordFillersRepo } from './AccordFillersRepo'
import { ResultAsync } from 'neverthrow'
import { ApiError, throwError } from '@src/common/error'
import { VoteFactory } from '@src/factories/VoteFactory'

export interface FragranceAccordRow extends Selectable<DB['fragranceAccords']>, MyVote {
  accordId: number
  name: string
  color: string
}

export interface VoteOnAccordParams {
  userId: number
  fragranceId: number
  accordId: number
  vote?: boolean | null | undefined
}

export class FragranceAccordsRepo extends TableService<'fragranceAccords', FragranceAccordRow> {
  fillers: AccordFillersRepo
  votes: AccordVotesRepo

  voteFactory = new VoteFactory()

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceAccords')

    this.fillers = new AccordFillersRepo(sources)
    this.votes = new AccordVotesRepo(sources)

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        return this
          .Table
          .connection
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

  vote (
    params: VoteOnAccordParams
  ): ResultAsync<FragranceAccordRow, ApiError> {
    const db = this.sources.db

    return ResultAsync
      .fromPromise(
        db
          .transaction()
          .execute(async trx => {
            this.withConnection(trx)
            this.votes.withConnection(trx)

            return await this
              .voteInner(params)
              .match(
                row => row,
                throwError
              )
              .finally(() => {
                this.withConnection(db)
                this.votes.withConnection(db)
              })
          }),
        error => ApiError.fromDatabase(error)
      )
  }

  private voteInner (
    params: VoteOnAccordParams
  ): ResultAsync<FragranceAccordRow, ApiError> {
    const { userId, fragranceId, accordId, vote } = params
    const [value, deletedAt, updatedAt] = this.voteFactory.value(vote)

    return this
      .findOrCreate(
        eb => eb.and([
          eb('fragranceAccords.fragranceId', '=', fragranceId),
          eb('fragranceAccords.accordId', '=', accordId)
        ]),
        {
          fragranceId,
          accordId
        }
      )
      .andThen(fragranceAccordRow => this
        .votes
        .vote({
          userId,
          fragranceAccordId: fragranceAccordRow.id,
          vote: value,
          updatedAt,
          deletedAt
        })
        .map(({ previousVoteRow }) => ({ fragranceAccordRow, previousVoteRow }))
      )
      .andThen(({ fragranceAccordRow, previousVoteRow }) => {
        const prev = previousVoteRow?.vote ?? 0
        const next = value

        const [
          likesDelta,
          dislikesDelta
        ] = this.voteFactory.getDeltas(prev, next)

        const updated = this.voteFactory.getUpdatedValuesObj(likesDelta, dislikesDelta)

        return this
          .updateOne(
            eb => eb('fragranceAccords.id', '=', fragranceAccordRow.id),
            updated
          )
      })
      .andThen(row => this
        .findOne(
          eb => eb('fragranceAccords.id', '=', row.id)
        )
      )
  }
}
