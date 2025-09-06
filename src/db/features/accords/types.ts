import type { DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type AccordRow = Selectable<DB['accords']>
export type AccordImageRow = Selectable<DB['accordImages']>
