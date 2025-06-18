import { type DB } from '@src/db/schema'
import { sql, type Selectable } from 'kysely'
import { type MyVote, TableService } from './TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type ApiServiceContext } from './ApiService'
import { FragranceImagesRepo } from './repositories/FragranceImageRepo'
import { FragranceTraitsRepo } from './repositories/FragranceTraitsRepo'
import { FragranceAccordsRepo } from './repositories/FragranceAccordsRepo'
import { FragranceNotesRepo } from './repositories/FragranceNotesRepo'
import { FragranceReviewsRepo } from './repositories/FragranceReviewsRepo'
import { FragranceCollectionRepo } from './repositories/FragranceCollectionRepo'
import { FragranceSearchRepo } from './repositories/FragranceSearchRepo'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { FragranceVotesRepo, type FragranceVoteRow } from './repositories/FragranceVotesRepo'
import { ApiError } from '@src/common/error'
import { VoteFactory } from '@src/factories/VoteFactory'

export type FragranceRow = Selectable<DB['fragrances']> & MyVote

export class FragranceService extends TableService<'fragrances', FragranceRow> {
  images: FragranceImagesRepo
  traits: FragranceTraitsRepo
  accords: FragranceAccordsRepo
  notes: FragranceNotesRepo
  reviews: FragranceReviewsRepo
  collections: FragranceCollectionRepo
  votes: FragranceVotesRepo

  searcher: FragranceSearchRepo

  voteFactory = new VoteFactory()

  constructor (sources: ApiDataSources) {
    super(sources, 'fragrances')

    this.images = new FragranceImagesRepo(sources)
    this.traits = new FragranceTraitsRepo(sources)
    this.accords = new FragranceAccordsRepo(sources)
    this.notes = new FragranceNotesRepo(sources)
    this.reviews = new FragranceReviewsRepo(sources)
    this.collections = new FragranceCollectionRepo(sources)
    this.votes = new FragranceVotesRepo(sources)

    this.searcher = new FragranceSearchRepo(sources)

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

  vote (
    params: FragranceVoteParams
  ): ResultAsync<FragranceVoteRow, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .sources
          .db
          .transaction()
          .execute(async trx => {
            const db = this.sources.db

            this.withConnection(trx)
            this.votes.withConnection(trx)

            return await this
              .voteInner(params)
              .match(
                row => row,
                error => { throw error }
              )
              .finally(() => {
                this.withConnection(db)
                this.votes.withConnection(db)
              })
          }),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  private voteInner (
    params: FragranceVoteParams
  ): ResultAsync<FragranceVoteRow, ApiError> {
    const { userId, fragranceId, vote } = params
    const [value, deletedAt] = this.voteFactory.value(vote)

    return this
      .votes
      .findOne(
        eb => eb.and([
          eb('fragranceVotes.userId', '=', userId),
          eb('fragranceVotes.fragranceId', '=', fragranceId)
        ])
      )
      .orElse(error => {
        if (error.status === 404) return okAsync(null)
        return errAsync(error)
      })
      .andThen(existing => this
        .votes
        .create({ userId, fragranceId, vote: value, deletedAt })
        .map(row => ({ existing, row }))
      )
      .andThen(({ existing, row }) => {
        const prev = existing?.vote ?? 0
        const next = value
        const [likesCount, dislikesCount] = this.voteFactory.delta(prev, next)
        return this
          .update(
            eb => eb('fragrances.id', '=', fragranceId),
            eb => ({
              likesCount: eb('likesCount', '+', likesCount),
              dislikesCount: eb('dislikesCount', '+', dislikesCount),
              voteScore: sql<number>`(likes_count + ${likesCount}) - (dislikes_count + ${dislikesCount})`
            })
          )
          .map(() => row)
      })
  }
}

export interface FragranceVoteParams {
  userId: number
  fragranceId: number
  vote: boolean | null | undefined
}
