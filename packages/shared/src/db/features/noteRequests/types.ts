import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type NoteRequestRow = Selectable<DB['noteRequests']>
export type NoteRequestImageRow = Selectable<DB['noteRequestImages']>
export type NoteRequestVoteRow = Selectable<DB['noteRequestVotes']>
export type NoteRequestVoteCountRow = Selectable<DB['noteRequestVoteCounts']>
