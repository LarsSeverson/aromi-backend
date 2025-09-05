import type { DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type NoteRequestRow = Selectable<DB['noteRequests']>
export type NoteRequestImageRow = Selectable<DB['noteRequestImages']>
export type NoteRequestVoteRow = Selectable<DB['noteRequestVotes']>
