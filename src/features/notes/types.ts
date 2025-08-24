import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'

export type NoteRow = Selectable<DB['notes']>
