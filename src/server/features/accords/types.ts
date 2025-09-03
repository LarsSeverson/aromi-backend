import { type DB } from '@src/generated/db-schema'
import { type Selectable } from 'kysely'

export type AccordRow = Selectable<DB['accords']>
