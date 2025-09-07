import type { DB } from '@src/db'
import type { Selectable } from 'kysely'

export type AccordRow = Selectable<DB['accords']>
export type AccordImageRow = Selectable<DB['accordImages']>
