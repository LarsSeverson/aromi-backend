import type { DB } from '@src/db'
import type { Selectable } from 'kysely'

export type BrandRow = Selectable<DB['brands']>
export type BrandImageRow = Selectable<DB['brandImages']>
