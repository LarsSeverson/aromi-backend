import type { SomeRequestImageRow, SomeRequestRow, SomeRequestVoteCountRow, SomeRequestVoteRow } from '../types.js'
import type { RequestImageService } from './RequestImageService.js'
import type { RequestVoteService } from './RequestVoteService.js'
import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'

export abstract class RequestService<
  R extends SomeRequestRow = SomeRequestRow,
  I extends SomeRequestImageRow = SomeRequestImageRow,
  V extends SomeRequestVoteRow = SomeRequestVoteRow,
  C extends SomeRequestVoteCountRow = SomeRequestVoteCountRow
> extends FeaturedTableService<R> {
  abstract images: RequestImageService<I>
  abstract votes: RequestVoteService<V, C>
}
