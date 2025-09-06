import type { DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type NoteRow = Selectable<DB['notes']>
export type NoteImageRow = Selectable<DB['noteImages']>
