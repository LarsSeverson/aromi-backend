import { TableService } from '@src/db/services/TableService.js'
import type { SomeRequestVoteCountRow, SomeRequestVoteRow } from '../types.js'

export abstract class RequestVoteService<
  V extends SomeRequestVoteRow,
  C extends SomeRequestVoteCountRow
> extends TableService<V> {
  abstract counts: TableService<C>
}
