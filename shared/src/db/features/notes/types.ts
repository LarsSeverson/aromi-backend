import type { DB } from '@src/db'
import type { Selectable } from 'kysely'

export type NoteRow = Selectable<DB['notes']>
export type NoteImageRow = Selectable<DB['noteImages']>
