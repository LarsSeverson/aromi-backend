import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type BrandRow = Selectable<DB['brands']>
export type BrandImageRow = Selectable<DB['brandImages']>

export type BrandEditRow = Selectable<DB['brandEdits']>