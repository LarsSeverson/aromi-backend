import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type AccordRow = Selectable<DB['accords']>
export type AccordEditRow = Selectable<DB['accordEdits']>
export type AccordImageRow = Selectable<DB['accordImages']>
