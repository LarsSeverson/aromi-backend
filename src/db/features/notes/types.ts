import type { DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type NoteRow = Selectable<DB['notes']>
