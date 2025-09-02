import { type DB } from '@src/db/schema'
import { type NoteRequest } from '@src/generated/gql-types'
import { type Selectable } from 'kysely'

export type NoteRequestRow = Selectable<DB['noteRequests']>
export type NoteRequestImageRow = Selectable<DB['noteRequestImages']>
export type NoteRequestVoteRow = Selectable<DB['noteRequestVotes']>

export interface INoteRequestSummary extends Omit<NoteRequest, 'image' | 'user' | 'votes'> {}

export type NoteRequestLoadersKey = string
