import { ApiError } from '@src/utils/error'
import { ResultAsync } from 'neverthrow'
import { WorkerJob } from '../WorkerJob'
import { type WorkerContext } from '../../context'
import { VOTE_COUNT_THRESHOLD } from './types'
import { AccordPromoter } from './AccordPromoter'

export class PromoteRequests extends WorkerJob {
  accords: AccordPromoter

  constructor (context: WorkerContext) {
    super(context, 'promote_requests')

    this.accords = new AccordPromoter(context)
  }

  handle (): ResultAsync<this, ApiError> {
    return ResultAsync
      .combine([
        this.promoteFragrances(),
        this.promoteBrands(),
        this.promoteAccords(),
        this.promoteNotes()
      ])
      .map(() => this)
  }

  private promoteFragrances (): ResultAsync<this, ApiError> {
    const { fragranceRequests } = this.context.services

    return ResultAsync
      .fromPromise(
        fragranceRequests
          .build()
          .selectFrom('fragranceRequests')
          .innerJoin('fragranceRequestVotes', 'fragranceRequestVotes.requestId', 'fragranceRequests.id')
          .selectAll('fragranceRequests')
          .groupBy('fragranceRequests.id')
          .having(eb =>
            eb
              .fn
              .sum<number>(
              eb
                .case()
                .when('fragranceRequestVotes.vote', '=', 1)
                .then(1)
                .else(0)
                .end()
            ),
          '>=',
          VOTE_COUNT_THRESHOLD
          )
          .execute(),
        error => ApiError.fromDatabase(error)
      )
      .andTee(() => {
        // call lambda
      })
      .map(() => this)
  }

  private promoteBrands (): ResultAsync<this, ApiError> {
    const { brandRequests } = this.context.services

    return ResultAsync
      .fromPromise(
        brandRequests
          .build()
          .selectFrom('brandRequests')
          .innerJoin('brandRequestVotes', 'brandRequestVotes.requestId', 'brandRequests.id')
          .selectAll('brandRequests')
          .groupBy('brandRequests.id')
          .having(eb =>
            eb
              .fn
              .sum<number>(
              eb
                .case()
                .when('brandRequestVotes.vote', '=', 1)
                .then(1)
                .else(0)
                .end()
            ),
          '>=',
          VOTE_COUNT_THRESHOLD
          )
          .execute(),
        error => ApiError.fromDatabase(error)
      )
      .andTee(() => {
        // call lambda
      })
      .map(() => this)
  }

  private promoteAccords (): ResultAsync<this, ApiError> {
    const { accordRequests } = this.context.services

    return ResultAsync
      .fromPromise(
        accordRequests
          .build()
          .selectFrom('accordRequests')
          .innerJoin('accordRequestVotes', 'accordRequestVotes.requestId', 'accordRequests.id')
          .selectAll('accordRequests')
          .groupBy('accordRequests.id')
          .having(eb =>
            eb
              .fn
              .sum<number>(
              eb
                .case()
                .when('accordRequestVotes.vote', '=', 1)
                .then(1)
                .else(0)
                .end()
            ),
          '>=',
          VOTE_COUNT_THRESHOLD
          )
          .where('accordRequests.requestStatus', '=', 'PENDING')
          .execute(),
        error => ApiError.fromDatabase(error)
      )
      .andThen(rows => ResultAsync
        .fromSafePromise(
          this
            .accords
            .promote(rows)
        )
      )
      .map(() => this)
  }

  private promoteNotes (): ResultAsync<this, ApiError> {
    const { noteRequests } = this.context.services

    return ResultAsync
      .fromPromise(
        noteRequests
          .build()
          .selectFrom('noteRequests')
          .innerJoin('noteRequestVotes', 'noteRequestVotes.requestId', 'noteRequests.id')
          .selectAll('noteRequests')
          .groupBy('noteRequests.id')
          .having(eb =>
            eb
              .fn
              .sum<number>(
              eb
                .case()
                .when('noteRequestVotes.vote', '=', 1)
                .then(1)
                .else(0)
                .end()
            ),
          '>=',
          VOTE_COUNT_THRESHOLD
          )
          .execute(),
        error => ApiError.fromDatabase(error)
      )
      .andTee(() => {
        // call lambda
      })
      .map(() => this)
  }
}
