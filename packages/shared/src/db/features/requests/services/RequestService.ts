import type { SomeRequestRow, SomeRequestVoteCountRow, SomeRequestVoteRow } from '../types.js'
import type { RequestVoteService } from './RequestVoteService.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export abstract class RequestService<
  R extends SomeRequestRow = SomeRequestRow,
  V extends SomeRequestVoteRow = SomeRequestVoteRow,
  C extends SomeRequestVoteCountRow = SomeRequestVoteCountRow
> extends FeaturedTableService<R> {
  abstract votes: RequestVoteService<V, C>
}
