import type { DB } from '@src/db'
import type { Selectable } from 'kysely'

export type NoteRequestRow = Selectable<DB['noteRequests']>
export type NoteRequestImageRow = Selectable<DB['noteRequestImages']>
export type NoteRequestVoteRow = Selectable<DB['noteRequestVotes']>
