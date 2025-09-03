import { type DB } from '@src/generated/db-schema'
import { type Selectable } from 'kysely'

export type NoteRow = Selectable<DB['notes']>
