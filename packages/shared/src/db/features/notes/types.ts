import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type NoteRow = Selectable<DB['notes']>
export type NoteImageRow = Selectable<DB['noteImages']>
export type NoteEditRow = Selectable<DB['noteEdits']>
