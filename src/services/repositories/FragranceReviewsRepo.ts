import { TableService, type MyVote } from '../TableService'
import { type Selectable } from 'kysely'
import { type DB } from '@src/db/schema'
import { type ApiDataSources } from '@src/datasources/datasources'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { ApiError, throwError } from '@src/common/error'
import { VoteFactory } from '@src/factories/VoteFactory'
import { ReviewVotesRepo } from './ReviewVotesRepo'
import { ReviewReportsRepo } from './ReviewReportsRepo'

export type FragranceReviewRow = Selectable<DB['fragranceReviews']> & MyVote

export class FragranceReviewsRepo extends TableService<'fragranceReviews', FragranceReviewRow> {
  dist: FragranceReviewsDistRepo
  votes: ReviewVotesRepo
  reports: ReviewReportsRepo

  voteFactory = new VoteFactory()

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceReviews')

    this.dist = new FragranceReviewsDistRepo(sources)
    this.votes = new ReviewVotesRepo(sources)
    this.reports = new ReviewReportsRepo(sources)

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        return this
          .Table
          .connection
          .selectFrom('fragranceReviews')
          .leftJoin('fragranceReviewVotes as rv', join =>
            join
              .onRef('rv.fragranceReviewId', '=', 'fragranceReviews.id')
              .on('rv.userId', '=', userId)
              .on('rv.deletedAt', 'is', null)
          )
          .selectAll('fragranceReviews')
          .select('rv.vote as myVote')
      })
  }

  vote (params: ReviewVoteParams): ResultAsync<FragranceReviewRow, ApiError> {
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

  voteInner (
    params: ReviewVoteParams
  ): ResultAsync<FragranceReviewRow, ApiError> {
    const { userId, reviewId, vote } = params
    const [value, deletedAt, updatedAt] = this.voteFactory.value(vote)

    return this
      .votes
      .findOne(
        eb => eb.and([
          eb('fragranceReviewVotes.userId', '=', userId),
          eb('fragranceReviewVotes.fragranceReviewId', '=', reviewId)
        ])
      )
      .orElse(error => {
        if (error.status === 404) return okAsync(null)
        return errAsync(error)
      })
      .andThen(existing => this
        .votes
        .upsert(
          {
            userId,
            fragranceReviewId: reviewId,
            vote: value,
            deletedAt
          },
          oc => oc
            .columns(['userId', 'fragranceReviewId'])
            .doUpdateSet(
              {
                vote: value,
                deletedAt,
                updatedAt
              }
            )
        )
        .map(upserted => ({ existing, upserted }))
      )
      .andThen(({ existing }) => {
        const prev = existing?.vote ?? 0
        const next = value

        const [
          likesDelta,
          dislikesDelta
        ] = this.voteFactory.getDeltas(prev, next)

        const [
          likesCount,
          dislikesCount,
          voteScore
        ] = this.voteFactory.getUpdatedValues(likesDelta, dislikesDelta)

        return this
          .updateOne(
            eb => eb('fragranceReviews.id', '=', reviewId),
            {
              likesCount,
              dislikesCount,
              voteScore
            }
          )
      })
  }
}

export type FragranceReviewDistRow = Pick<Selectable<DB['fragranceReviews']>, 'fragranceId' | 'rating'> & { count: number }

export class FragranceReviewsDistRepo extends TableService<'fragranceReviews', FragranceReviewDistRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceReviews')

    this
      .Table
      .setBaseQueryFactory(() => sources
        .db
        .selectFrom('fragranceReviews')
        .select([
          'fragranceId',
          'rating',
          sources
            .db
            .fn
            .count<number>('rating')
            .as('count')
        ])
      )
  }
}

export interface ReviewVoteParams {
  userId: number
  reviewId: number
  vote?: boolean | null | undefined
}
