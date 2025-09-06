import type { DB } from '@generated/db-schema'
import type { Selectable } from 'kysely'

export type BrandRow = Selectable<DB['brands']>
export type BrandImageRow = Selectable<DB['brandImages']>
