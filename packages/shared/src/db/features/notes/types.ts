import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type NoteRow = Selectable<DB['notes']>
export type NoteImageRow = Selectable<DB['noteImages']>
export type NoteEditRow = Selectable<DB['noteEdits']>
export type NoteRequestRow = Selectable<DB['noteRequests']>
export type NoteRequestVoteRow = Selectable<DB['noteRequestVotes']>
export type NoteRequestScoreRow = Selectable<DB['noteRequestScores']>
