import { type DB } from '@src/generated/db-schema'
import { type Selectable } from 'kysely'

export type BrandRow = Selectable<DB['brands']>
export type AccordRow = Selectable<DB['accords']>
export type NoteRow = Selectable<DB['notes']>
