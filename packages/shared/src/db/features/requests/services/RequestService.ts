import type { SomeRequestRow, SomeRequestScoreRow, SomeRequestVoteRow } from '../types.js'
import type { RequestVoteService } from './RequestVoteService.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export abstract class RequestService<
  R extends SomeRequestRow = SomeRequestRow,
  V extends SomeRequestVoteRow = SomeRequestVoteRow,
  C extends SomeRequestScoreRow = SomeRequestScoreRow
> extends FeaturedTableService<R> {
  abstract votes: RequestVoteService<V, C>
}
