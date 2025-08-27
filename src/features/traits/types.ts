import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'

export type TraitTypeRow = Selectable<DB['traitTypes']>
export type TraitOptionRow = Selectable<DB['traitOptions']>
