import { type DB } from '@generated/db-schema'
import { type Selectable } from 'kysely'

export type FragranceRow = Selectable<DB['fragrances']>
