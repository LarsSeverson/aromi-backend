import { TableService } from '@src/db/services/TableService.js'
import type { SomeRequestScoreRow, SomeRequestVoteRow } from '../types.js'

export abstract class RequestVoteService<
  V extends SomeRequestVoteRow,
  C extends SomeRequestScoreRow
> extends TableService<V> {
  abstract scores: TableService<C>
}
